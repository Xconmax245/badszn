import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer then to Data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const url = await uploadToCloudinary(fileUri, folder);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("❌ Upload Route Error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
