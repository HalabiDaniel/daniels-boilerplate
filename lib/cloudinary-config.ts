import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Validate configuration
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  console.warn('Warning: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
}

if (!process.env.CLOUDINARY_API_KEY) {
  console.warn('Warning: CLOUDINARY_API_KEY is not set');
}

if (!process.env.CLOUDINARY_API_SECRET) {
  console.warn('Warning: CLOUDINARY_API_SECRET is not set');
}

export default cloudinary;
