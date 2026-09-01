import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.log("Cloudinary env vars not set, preserving local file fallback");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Safely remove local file after successful upload to Cloudinary
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return response;
  } catch (error) {
    console.error("Cloudinary upload failed, preserving local file fallback:", error.message);
    return null;
  }
};

const deleteFromCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return null;
    const publicId = fileUrl.split("/").pop().split(".")[0];

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log("Error deleting from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };

