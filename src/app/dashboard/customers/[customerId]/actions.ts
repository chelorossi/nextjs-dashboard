// "use server";

// // import { authenticatedAction } from "@/lib/safe-action";
// // import {
// //   getGroupImageUploadUrlUseCase,
// //   updateGroupImageUseCase,
// // } from "@/use-cases/files";
// // import { updateCustomerImageUseCase } from "@/app/lib/buckets";
// // import {
// //   toggleGroupVisibilityUseCase,
// //   updateGroupDescriptionUseCase,
// //   updateGroupNameUseCase,
// //   updateGroupSocialLinksUseCase,
// // } from "@/use-cases/groups";
// // import { revalidatePath } from "next/cache";
// // import { z } from "zod";
// import getSession, { auth } from "@/auth/auth";
// import { FormSchemaImageURL } from "@/db/schema";
// import { updateCustomerImageUseCase } from "@/use-cases/buckets";
// import { revalidatePath } from "next/cache";
// import { z } from "zod";

// export const uploadImageAction = async (
//   prevState: string | undefined,
//   formData: FormData
// ) => {
//   await getSession();

//   const validatedFields = FormSchemaImageURL.safeParse({
//     image_url: formData.get("image_url") || undefined,
//     fileWrapper: formData.get("fileWrapper") || undefined,
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Missing Fields. Failed to Create Invoice.",
//     };
//   }

//   const { fileWrapper, customerId } = validatedFields.data;

//   const file = fileWrapper.get("file") as File;
//   await updateCustomerImageUseCase({
//     customerId: customerId,
//     file,
//   });
//   revalidatePath(`/dashboard/customers/${customerId}/settings`);
// };

// // export async function serverAction() {
// //   const session = await getSession();
// //   const userRole = session?.user?.role;

// //   // Check if user is authorized to perform the action
// //   if (userRole !== "admin") {
// //     throw new Error(
// //       "Unauthorized access: User does not have admin privileges."
// //     );
// //   }

// //   // Proceed with the action for authorized users
// //   // ... implementation of the action
// // }

// // export const uploadImageAction = authenticatedAction
// //   .createServerAction()
// //   .input(
// //     z.object({
// //       groupId: z.number(),
// //       fileWrapper: z.instanceof(FormData),
// //     })
// //   )
// //   .handler(async ({ input, ctx: { user } }) => {
// //     const file = input.fileWrapper.get("file") as File;
// //     await updateCustomerImageUseCase(user, { groupId: input.groupId, file });
// //     revalidatePath(`/dashboard/groups/${input.groupId}/settings`);
// //   });
