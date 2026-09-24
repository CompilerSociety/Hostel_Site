import { v2 as cloudinary } from 'cloudinary';
import { fileTypeFromBuffer } from 'file-type';
import { HttpError } from '../middleware/http.js';

function provider() {
  const { CLOUDINARY_CLOUD_NAME: cloud_name, CLOUDINARY_API_KEY: api_key, CLOUDINARY_API_SECRET: api_secret } = process.env;
  if (!cloud_name || !api_key || !api_secret) throw new HttpError(503, 'Image storage is not configured');
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  return cloudinary;
}
export async function uploadImage(file) {
  const type = await fileTypeFromBuffer(file.buffer);
  if (!type || !['image/jpeg', 'image/png', 'image/webp'].includes(type.mime)) throw new HttpError(400, 'Only JPEG, PNG, and WebP images are supported');
  const service = provider();
  return new Promise((resolve, reject) => {
    service.uploader.upload_stream({ folder: 'hostelhub', resource_type: 'image', transformation: [{ width: 2400, height: 2400, crop: 'limit' }] }, (error, result) => {
      if (error) return reject(new HttpError(502, 'Image upload failed'));
      resolve({ publicId: result.public_id, url: result.secure_url });
    }).end(file.buffer);
  });
}
export async function deleteImage(publicId) { await provider().uploader.destroy(publicId); }
