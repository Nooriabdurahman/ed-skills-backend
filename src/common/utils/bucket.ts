import minioClient from './minioClient';

export async function ensureBucketExists(bucketName: string) {
  const exists = await minioClient.bucketExists(bucketName);
  if (!exists) {
    await minioClient.makeBucket(bucketName, 'us-east-1');
    // اگر می‌خواهی باکت خواندنی‌عمومی باشد (public), می‌توانی policy اضافه کنی:
    const policy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${bucketName}/*`]
        }
      ]
    };
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
  }
}
