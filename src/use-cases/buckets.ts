// import { MAX_UPLOAD_IMAGE_SIZE } from "@/app/config";
// import { updateCustomerImage } from "@/lib/actions";
// // import { getGroupById, updateGroup } from "@/data-access/groups";
// import {
//   getFileUrl,
//   //   getPresignedPostUrl,
//   uploadFileToBucket,
// } from "@/lib/files";
// // import { UserSession } from "@/use-cases/types";
// import { v4 as uuidv4 } from "uuid";
// // export async function getGroupImageUploadUrlUseCase(
// //   authenticatedUser: UserSession,
// //   { groupId, contentType }: { groupId: GroupId; contentType: string }
// // ) {
// // //   await assertAdminOrOwnerOfGroup(authenticatedUser, groupId);
// // //   const fileName = `${groupId}-image`;
// // //   return getPresignedPostUrl(fileName, contentType);
// // }

// export async function updateCustomerImageUseCase({
//   customerId,
//   file,
// }: {
//   customerId: string;
//   file: File;
// }) {
//   if (!file.type.startsWith("image/")) {
//     throw new Error("File should be an image.");
//   }

//   if (file.size > MAX_UPLOAD_IMAGE_SIZE) {
//     throw new Error("File size should be less than 5MB.");
//   }

//   const imageId = uuidv4();

//   await updateCustomerImage(customerId, imageId);
//   await uploadFileToBucket(file, getGroupImageKey(customerId, imageId));
// }

// export function getGroupImageKey(customerId: string, imageId: string) {
//   return `images/${customerId}/images/${imageId}`;
// }

// // export async function getGroupImageUrlUseCase(
// //   authenticatedUser: UserSession | undefined,
// //   { groupId, imageId }: { groupId: GroupId; imageId: string }
// // ) {
// //   await assertGroupVisible(authenticatedUser, groupId);

// //   const url = await getFileUrl({
// //     key: getGroupImageKey(groupId, imageId),
// //   });

// //   return url;
// // }
