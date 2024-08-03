"use server";

import { signIn } from "@/auth/auth";
import prisma from "@/lib/db";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  CreateCustomerSchema,
  CreateInvoiceSchema,
  UpdateCustomerSchema,
  UpdateInvoiceSchema,
} from "@/db/schema";

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

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export type StateCustomer = {
  errors?: {
    name?: string[];
    email?: string[];
    image_url?: string[];
  };
  message: string;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoiceSchema.safeParse({
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

export async function createCustomer(
  prevState: StateCustomer,
  formData: FormData
) {
  const validatedFields = CreateCustomerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image_url: formData.get("image_url") || "/customers/no_image.jpeg",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
    };
  }

  const { name, email, image_url } = validatedFields.data;

  try {
    await prisma.customer.create({
      data: {
        name,
        email,
        image_url,
      },
    });
    revalidatePath("/dashboard/customers");
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Customer.",
    };
  }

  redirect("/dashboard/customers");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  console.log(prevState);
  const validatedFields = UpdateInvoiceSchema.safeParse({
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

export async function updateCustomer(
  id: string,
  prevState: StateCustomer,
  formData: FormData
) {
  console.log(prevState);
  const validatedFields = UpdateCustomerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    // image_url: formData.get("image_url") || "/no_image.jpg",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Customer.",
    };
  }

  const { name, email } = validatedFields.data;

  try {
    await prisma.customer.update({
      where: { id },
      data: {
        name,
        email,
      },
    });
    revalidatePath("/dashboard/customers");
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Customer.",
    };
  }

  return {
    message: "Customer Updated Successfully.",
  };

  // redirect("/dashboard/customers");
}

export async function updateCustomerImage(customerId: string, imageId: string) {
  try {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        image_url: imageId,
      },
    });
    revalidatePath("/dashboard/customers");
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Customer.",
    };
  }

  redirect("/dashboard/customers");
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

export async function deleteCustomer(id: string) {
  try {
    await prisma.customer.delete({
      where: { id },
    });
    revalidatePath("/dashboard/customers");
  } catch (error) {
    return { message: "Database Error: Failed to Delete Customer." };
  }
}
