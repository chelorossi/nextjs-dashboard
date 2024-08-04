import { lusitana } from "@/app/ui/fonts";
import { FileUploader } from "@/app/ui/profile/file-uploader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Profile</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <FileUploader />
      </div>
    </div>
  );
}
