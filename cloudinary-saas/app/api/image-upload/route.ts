import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // BUFFER
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // BASE64
    const base64Image = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // CLOUDINARY UPLOAD
    const uploadedImage = await cloudinary.uploader.upload(base64Image, {
      folder: "cloudinary-saas",
      resource_type: "image",

      // AUTO OPTIMIZATION
      quality: "auto",
      fetch_format: "auto",
    });

    // OPTIMIZED IMAGE
    const optimizedUrl = cloudinary.url(uploadedImage.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    // THUMBNAIL
    const thumbnailUrl = cloudinary.url(uploadedImage.public_id, {
      width: 500,
      crop: "fill",
      quality: "auto",
      fetch_format: "auto",
    });

    // DOWNLOAD URL
    const downloadUrl = cloudinary.url(uploadedImage.public_id, {
      flags: "attachment",
    });

return NextResponse.json({
  success: true,

  // CLOUDINARY PUBLIC ID
  publicId: uploadedImage.public_id,

  // ORIGINAL IMAGE
  imageUrl: uploadedImage.secure_url,

  // OPTIMIZED IMAGE
  optimizedUrl,

  // THUMBNAIL
  thumbnailUrl,

  // DOWNLOAD URL
  downloadUrl,

  // SHARE URL
  shareUrl: uploadedImage.secure_url,
});

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}