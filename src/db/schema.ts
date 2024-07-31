import { z } from "zod";

export const FormSchemaImageURL = z.object({
  customerId: z.string().uuid(),
  fileWrapper: z.instanceof(FormData),
});

export const FormSchemaInvoice = z.object({
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

export const FormSchemaCustomer = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please enter a name.",
  }),
  email: z.string({
    invalid_type_error: "Please enter an email.",
  }),
  image_url: z.string({
    invalid_type_error: "Please enter an image URL.",
  }),
});

export const CreateInvoiceSchema = FormSchemaInvoice.omit({
  id: true,
  date: true,
});
export const CreateCustomerSchema = FormSchemaCustomer.omit({ id: true });
// Use Zod to update the expected types
export const UpdateInvoiceSchema = FormSchemaInvoice.omit({
  id: true,
  date: true,
});
export const UpdateCustomerSchema = FormSchemaCustomer.omit({
  id: true,
  image_url: true,
});
