"use client";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/H5hGEs90t0J
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button";
import { JSX, SVGProps, useState } from "react";
import { uploadFiles } from "@/lib/upload/actions";
import { useFormState } from "react-dom";

export const FileUpload = () => {
  // const [file, setFile] = useState<string>();
  // const [fileEnter, setFileEnter] = useState(false);
  const initialState = {
    message: null,
  };
  const [state, formAction] = useFormState(uploadFiles, initialState);

  return (
    <div className="flex flex-col items-center justify-center">
      <form action={formAction}>
        <input type="file" id="file" name="file" multiple />
        <Button type="submit">Upload</Button>
        <p>Upload your files</p>
      </form>
      {state?.status && (
        <div className={`state-message ${state.status}`}>{state.message}</div>
      )}
      <div id="files-upload-success" aria-live="polite" aria-atomic="true">
        {state.filesUploaded &&
          state.fileUploaded.map((name: string) => (
            <p className="mt-2 text-sm text-red-500" key={name}>
              {name}
            </p>
          ))}
      </div>
    </div>
  );
};

// function CloudUploadIcon(
//   props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
// ) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
//       <path d="M12 12v9" />
//       <path d="m16 16-4-4-4 4" />
//     </svg>
//   );
// }

// function FileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
//       <path d="M14 2v4a2 2 0 0 0 2 2h4" />
//     </svg>
//   );
// }

// function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M3 6h18" />
//       <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
//       <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//     </svg>
//   );
// }

// function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6 6 18" />
//       <path d="m6 6 12 12" />
//     </svg>
//   );
// }
