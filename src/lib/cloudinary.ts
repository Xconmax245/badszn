import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Server-side helper to upload an image via stream (memory-safe for large files)
 */
export async function uploadToCloudinary(fileBuffer: Buffer, folder: string = "products"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          console.error("Cloudinary Stream Upload Error:", error);
          reject(error || new Error("Failed to upload image to Cloudinary"));
        }
      }
    );
    
    // Write buffer directly to stream
    uploadStream.end(fileBuffer);
  });
}
