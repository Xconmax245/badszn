import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Server-side helper to upload an image from a buffer or base64 string
 */
export async function uploadToCloudinary(fileUri: string, folder: string = "products") {
  try {
    const res = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: "auto",
    });
    return res.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}
