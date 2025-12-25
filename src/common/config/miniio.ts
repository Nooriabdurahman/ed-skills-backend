import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'YOUR_ACCESS_KEY',
  secretKey: process.env.MINIO_SECRET_KEY || 'YOUR_SECRET_KEY'
});

// ساخت bucket در صورت عدم وجود
const bucketName = 'uploads';
(async () => {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, '');
      console.log(`Bucket ${bucketName} created successfully`);
    }
  } catch (err) {
    console.error(err);
  }
})();


export default minioClient;

