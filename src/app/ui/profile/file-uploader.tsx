"use client";

import { UploadInstructions } from "@/app/ui/profile/upload-components";
import { uploadFilesAction } from "@/lib/upload/actions";
import { startTransition, useActionState, useEffect, useState } from "react";

type UploadStateType = {
  success: boolean | null;
  message: string;
  filesUploaded: { fileName: string; fileSize: number }[];
};

export const FileUploader = () => {
  const initialState = { message: null, status: "error" };
  const [state, formAction, pending] = useActionState(
    uploadFilesAction,
    initialState
  );
  const [filesDropped, setFilesDropped] = useState([]);

  useEffect(() => {
    if (state.message) {
      state.success ? console.log(state.message) : console.error(state.message);
    }
  }, [state]);

  return (
    <div className="flex flex-col items-center justify-center">
      <UploadForm
        formAction={formAction}
        state={state}
        pending={pending}
        filesDropped={filesDropped}
      >
        <UploadInstructions
          formAction={formAction}
          state={state}
          pending={pending}
          filesDropped={filesDropped}
          setFilesDropped={setFilesDropped}
        />
      </UploadForm>
    </div>
  );
};

export function UploadForm({
  children,
  formAction,
  state,
  pending,
  filesDropped,
}: {
  children: React.ReactNode;
  formAction: any;
  state: UploadStateType;
  pending: boolean;
  filesDropped: any[];
}) {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (filesDropped.length === 0) {
      state.success = false;
      state.message = "No files to upload";
      return;
    }
    const formData = new FormData();
    filesDropped.forEach((file) => {
      formData.append("files", file);
    });
    startTransition(async () => {
      await formAction(formData);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit}>
        {UploadState(state)}
        {children}
      </form>
    </div>
  );
}

function UploadState(state: UploadStateType) {
  return (
    <div id="files-upload-success" aria-live="polite" aria-atomic="true">
      {state.success ? (
        <p className="mt-2 text-sm text-green-500">{state.message}</p>
      ) : (
        <p className="mt-2 text-sm text-red-500">{state.message}</p>
      )}
    </div>
  );
}
