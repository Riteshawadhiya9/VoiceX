import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

const uploadOnCloudinary = async (filePath) => {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        const uploadResult = await cloudinary.uploader
            .upload(filePath)
        fs.unlinkSync(filePath)
        return uploadResult.secure_url
    } catch (error) {
        try {
            fs.unlinkSync(filePath)
        } catch (unlinkError) {
            // file might not exist
        }
        throw new Error(`Cloudinary upload error: ${error.message}`)
    }
}

export default uploadOnCloudinary