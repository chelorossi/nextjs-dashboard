"use server";

import { signIn } from "@/auth";
import prisma from "@/lib/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "AccessDenied":
          return "Access Denied.";
        case "AccountNotLinked":
          return "Account not linked.";
        case "InvalidCallbackUrl":
          return "Invalid callback URL.";
        case "AdapterError":
          return "Adapter error.";
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  // const date = new Date().toISOString().split("T")[0];

  try {
    await prisma.invoice.create({
      data: {
        customer_id: customerId,
        amount: amountInCents,
        status,
      },
    });
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  redirect("/dashboard/invoices");
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  console.log(prevState);
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  try {
    await prisma.invoice.update({
      where: { id },
      data: {
        customer_id: customerId,
        amount: amountInCents,
        status,
      },
    });
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}