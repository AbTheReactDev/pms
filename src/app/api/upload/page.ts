import cloudinary from "@/utils/cloudinary";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Upload to Cloudinary with folder
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER, // Upload to a specific folder
    });

    res.status(200).json({ imageUrl: uploadResponse.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
}
