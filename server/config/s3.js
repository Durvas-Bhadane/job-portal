const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// ── S3 Client ─────────────────────────────────────────────────
// On EC2 with an IAM Role attached, you do NOT need to pass
// accessKeyId / secretAccessKey — the SDK picks up credentials
// automatically from the instance metadata service (IMDS).
// Only provide explicit keys for local development via .env.
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  ...(process.env.NODE_ENV !== 'production' && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});

const BUCKET = process.env.AWS_S3_BUCKET_NAME;

// ── Multer-S3 upload factory ──────────────────────────────────
const createUploader = (folder, allowedTypes) =>
  multer({
    storage: multerS3({
      s3: s3Client,
      bucket: BUCKET,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${folder}/${uuidv4()}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
      }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  });

// Profile image uploader
const uploadProfileImage = createUploader('profile-images', [
  'image/jpeg',
  'image/png',
  'image/webp',
]);

// Resume uploader
const uploadResume = createUploader('resumes', [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

// Company logo uploader
const uploadCompanyLogo = createUploader('company-logos', [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]);

// ── Delete a file from S3 ─────────────────────────────────────
const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract the key from the full S3 URL
    const url = new URL(fileUrl);
    const key = url.pathname.slice(1); // remove leading "/"
    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    console.log(`Deleted S3 object: ${key}`);
  } catch (err) {
    console.error('S3 delete error:', err);
  }
};

// ── Pre-signed URL for private files (e.g. resumes) ──────────
const getPresignedUrl = async (key, expiresInSeconds = 3600) => {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
};

module.exports = {
  s3Client,
  uploadProfileImage,
  uploadResume,
  uploadCompanyLogo,
  deleteFromS3,
  getPresignedUrl,
};
