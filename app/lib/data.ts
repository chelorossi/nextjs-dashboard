import { sql } from "@vercel/postgres";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";
import prisma from "@/lib/db";

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log("Fetching revenue data delayed 3...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await prisma.revenue.findMany();
    console.log(data);
    console.log("Data fetch completed after 3 seconds.");

    return data;
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await prisma.invoice.findMany({
      select: {
        amount: true,
        customer: {
          select: {
            name: true,
            image_url: true,
            email: true,
          },
        },
        id: true,
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
    });

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = prisma.invoice.count();
    const customerCountPromise = prisma.customer.count();
    const invoicesPaidPromise = prisma.invoice.aggregate({
      _sum: { amount: true }, // Sum the amount field
      where: { status: "paid" },
    });
    const inovicesPendingPromise = prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: "pending" },
    });
    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoicesPaidPromise,
      inovicesPendingPromise,
    ]);

    const numberOfInvoices = Number(data[0] ?? "0");
    const numberOfCustomers = Number(data[1] ?? "0");
    const totalPaidInvoices = formatCurrency(Number(data[2]._sum.amount) ?? 0);
    const totalPendingInvoices = formatCurrency(data[3]._sum.amount ?? 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log("fetching invoices");

  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        status: true,
        customer: {
          select: {
            name: true,
            email: true,
            image_url: true,
          },
        },
      },
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
              },
            },
          },
          {
            customer: {
              email: {
                contains: query,
              },
            },
          },
          // {
          //   date: {
          //     contains: query,
          //   },
          // },
          {
            status: {
              contains: query,
            },
          },
        ],
      },
      orderBy: {
        date: "desc",
      },
      skip: offset,
      take: ITEMS_PER_PAGE,
    });
    console.log("invoices fetched");
    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await prisma.invoice.count({
      where: {
        OR: [
          {
            customer: {
              name: {
                contains: query,
              },
            },
          },
          {
            customer: {
              email: {
                contains: query,
              },
            },
          },
          {
            status: {
              contains: query,
            },
          },
        ],
      },
    });

    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findFirstOrThrow({
      select: {
        id: true,
        customer_id: true,
        amount: true,
        status: true,
      },
      where: {
        id: id,
      },
    });

    // Convert amount from cents to dollars
    (invoice.amount = invoice.amount / 100), console.log(invoice); // Invoice is an empty array []

    return invoice;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const customers = prisma.customer.findMany();
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image_url: true,
        invoices: {
          select: {
            id: true,
            amount: true,
            status: true,
          },
          where: {
            OR: [
              {
                status: "pending",
              },
              {
                status: "paid",
              },
            ],
          },
        },
      },
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            email: {
              contains: query,
            },
          },
        ],
      },
      orderBy: {
        name: "asc",
      },
    });

    const formattedCustomers = customers.map((customer) => {
      const total_invoices = customer.invoices.length;
      const total_pending = customer.invoices
        .filter((invoice) => invoice.status === "pending")
        .reduce((total, invoice) => total + invoice.amount, 0);
      const total_paid = customer.invoices
        .filter((invoice) => invoice.status === "paid")
        .reduce((total, invoice) => total + invoice.amount, 0);

      return {
        ...customer,
        total_invoices,
        total_pending: formatCurrency(total_pending),
        total_paid: formatCurrency(total_paid),
      };
    });

    return formattedCustomers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
