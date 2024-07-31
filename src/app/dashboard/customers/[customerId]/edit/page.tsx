import Form from "@/app/ui/customers/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {
  fetchInvoiceById,
  fetchCustomers,
  fetchCustomerById,
} from "@/lib/data";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: { customerId: string };
}) {
  const customerId = params.customerId;
  const customer = await fetchCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customer", href: "/dashboard/customers" },
          {
            label: "Edit Customer",
            href: `/dashboard/customers/${customerId}/edit`,
            active: true,
          },
        ]}
      />
      <Form customer={customer} />
    </main>
  );
}
