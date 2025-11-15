import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface FileUploadResult {
  url: string;
  publicId: string;
  originalFilename: string;
  format: string;
  bytes: number;
}

export async function uploadReceipt(
  file: Buffer,
  filename: string
): Promise<FileUploadResult> {
  try {
    const result = await cloudinary.uploader.upload(
      `data:application/octet-stream;base64,${file.toString('base64')}`,
      {
        resource_type: 'image',
        public_id: `move-receipts/${filename.replace(/\.[^/.]+$/, '')}-${Date.now()}`,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      }
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
      originalFilename: filename,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload receipt to Cloudinary');
  }
}

export async function deleteReceipt(publicId: string): Promise<void> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { 
      resource_type: 'image',
      invalidate: true
    });
    
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Delete failed with result: ${result.result}`);
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete receipt from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getOptimizedReceiptUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
  } = {}
): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: options.quality || 'auto',
    format: 'auto',
    width: options.width,
    height: options.height,
  });
}

export default cloudinary;