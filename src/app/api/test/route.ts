// import getSession from "@/auth/auth";

// export const dynamic = "force-dynamic"; // defaults to auto
export async function GET() {
  // try {
  // const session = await getSession();
  return Response.json({
    message: "Hello world test 1! session",
    // session: session,
  });
  // } catch (error) {
  //   return Response.json({ message: "Not authenticated" }, { status: 401 });
  // }
}
