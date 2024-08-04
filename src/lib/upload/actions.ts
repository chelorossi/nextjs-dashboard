"use server";

import { env } from "@/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "text/plain",
  "video/mp4",
  "video/mpeg",
];

const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID ?? "",
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY ?? "",
  },
});

export async function uploadFilesAction(
  prevState: any,
  formData: { getAll: (arg0: string) => any }
) {
  try {
    const files = formData.getAll("file");
    const filesUploaded = [];
    console.log("files", files);
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { fileName, fileSize } = await uploadFileToS3(
        buffer,
        file.name,
        file.type
      );
      filesUploaded.push({ fileName, fileSize });
    }
    revalidatePath("/dashboard/profile");
    return {
      message: "Files uploaded successfully",
      filesUploaded: filesUploaded,
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
    validateFile(file, fileName, mimetype);

    const command = new PutObjectCommand({
      Bucket: env.FILES_BUCKET,
      Key: `files/${fileName}`,
      Body: file,
      ContentType: mimetype,
    });

    console.error("Added file:", { fileName, fileSize: file.length });
    const fileSize = file.length; // Calculate file size in MB with 2 decimals

    return { fileName, fileSize };
  } catch (err) {
    console.error("S3 upload error:", err);
    throw new Error("Failed to upload file to S3");
  }
}

function validateFile(file: Buffer, fileName: string, mimetype: string) {
  if (!allowedMimeTypes.includes(mimetype)) {
    throw new Error(`Unsupported file type: ${mimetype}`);
  }

  if (file.length === 0) {
    throw new Error("File is empty");
  }

  if (fileName.length === 0) {
    throw new Error("File name is empty");
  }
}
