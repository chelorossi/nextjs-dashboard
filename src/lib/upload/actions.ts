"use server";

import { env } from "@/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID ?? "",
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY ?? "",
  },
});

export async function uploadFiles(
  prevState: any,
  formData: { getAll: (arg0: string) => any }
) {
  try {
    const files = formData.getAll("file");
    const uploadedFiles = [];
    console.log("files", files);
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadFileToS3(buffer, file.name, file.type);
      uploadedFiles.push(url);
    }
    revalidatePath("/dashboard/profile");
    return {
      message: "Files uploaded successfully",
      uploadedFiles,
    };
  } catch (error) {
    console.error("Error uploading files:", error);
    return { ...prevState, message: "Failed to upload files" };
  }
}

export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  mimetype: string
) {
  try {
    const command = new PutObjectCommand({
      Bucket: env.FILES_BUCKET,
      Key: `files/${fileName}`,
      Body: file,
      ContentType: mimetype,
    });

    const response = await client.send(command);
    console.log("File updated successfully response:", response);
    return { success: true }; // Return a plain object
  } catch (err) {
    console.error("S3 upload error:", err);
    throw new Error("Failed to upload file to S3");
  }
}
