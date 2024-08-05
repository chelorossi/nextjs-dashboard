"use server";

import { env } from "@/env";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/*",
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
  const files = formData.getAll("files");

  if (!files || files.length === 0) {
    return { ...prevState, success: false, message: "No files to upload" };
  }

  const filesUploaded = [];
  try {
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { fileName, fileSize } = await uploadFileToS3(
        buffer,
        file.name,
        file.type
      );
      filesUploaded.push({ fileName, fileSize });
    }
    console.log("files", files);
    revalidatePath("/dashboard/profile");
    return {
      success: true,
      message: "Files uploaded successfully",
      filesUploaded: filesUploaded,
    };
  } catch (error) {
    return { ...prevState, success: false, message: "Failed to upload files" };
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
    const response = await client.send(command);

    console.log("Added file:", { fileName, fileSize: file.length });

    const fileSize = file.length;
    return { fileName, fileSize };
  } catch (err) {
    console.error("S3 upload error:", err);
    throw new Error("Failed to upload file to S3");
  }
}

function validateFile(file: Buffer, fileName: string, mimetype: string) {
  if (file.length === 0) {
    throw new Error("File is empty");
  }
  // if (!allowedMimeTypes.includes(mimetype)) {
  //   throw new Error(`Unsupported file type: ${mimetype}`);
  // }

  if (fileName.length === 0) {
    throw new Error("File name is empty");
  }
}
