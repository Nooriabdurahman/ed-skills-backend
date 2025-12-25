import { randomUUID } from 'crypto';
import minioClient from '../common/utils/minioClient';
import { ensureBucketExists } from '../common/utils/bucket';
import prisma from '../common/config/database/prisma'; // فرض: export شده prisma client
import path from 'path';

const BUCKET = process.env.MINIO_BUCKET || 'profiles-picture';
const MINIO_HOST = process.env.MINIO_PUBLIC_HOST || `${process.env.MINIO_HOST || '127.0.0.1'}:${process.env.MINIO_PORT || 9000}`;
const USE_SSL = process.env.MINIO_USE_SSL === 'true';

export async function uploadProfilePicture(buffer: Buffer, originalName: string, userId: number) {
  // 1. اطمینان از وجود باکت
  await ensureBucketExists(BUCKET);

  // 2. اسم امن برای فایل بساز (برای جلوگیری از نام تکراری)
  const ext = path.extname(originalName) || '';
  const objectName = `profile-${userId}-${Date.now()}-${randomUUID()}${ext}`;

  // 3. آپلود با متادیتا (مثال Content-Type)
  await minioClient.putObject(BUCKET, objectName, buffer);

  // 4. ساختن URL عمومی
  // دو روش: (A) اگر باکت public است -> direct URL
  //           URL = http[s]://<host>:<port>/<bucket>/<object>
  //            توجه: اگر reverse proxy یا gateway داری، باید آن را استفاده کنی
  //         (B) اگر نمی‌خواهی باکت public کنی -> presigned URL با انقضاء
  // من هر دو را می‌سازم و اولویت می‌دهم direct اگر باکت public باشد (ما policy را ست کردیم)
  const protocol = USE_SSL ? 'https' : 'http';
  const directUrl = `${protocol}://${MINIO_HOST}/${BUCKET}/${encodeURIComponent(objectName)}`;

  // 5. ذخیره URL در دیتابیس (فرض: جدول user یا profile)
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { profilePicture: directUrl },
  });

  // 6. به عنوان بکاپ، یک presigned URL هم تولید کنیم (مثال 7 روز)
  const presigned = await minioClient.presignedUrl('GET', BUCKET, objectName, 7 * 24 * 60 * 60);

  // برگرداندن نتیجه (در response از front-end می‌تونی directUrl را استفاده کنی)
  return {
    directUrl,
    presignedUrl: presigned,
    objectName,
    updatedUser: updated
  };
}
