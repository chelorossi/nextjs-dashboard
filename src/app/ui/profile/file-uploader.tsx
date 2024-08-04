"use client";

import { Button } from "@/app/ui/components/button";
import { JSX, useActionState, useState } from "react";
import { uploadFilesAction } from "@/lib/upload/actions";
import {
  UploadInstructions,
  UploadedFilesList,
} from "@/app/ui/profile/upload-components";

type UploadStateType = {
  status: JSX.Element;
  message: string;
  filesUploaded: { fileName: string; fileSize: number }[];
};

export const FileUploader = () => {
  const initialState = { message: null };
  const [state, formAction, pending] = useActionState(
    uploadFilesAction,
    initialState
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <UploadForm formAction={formAction} state={state} pending={pending} />
      <UploadInstructions />
      <UploadedFilesList state={state} />
    </div>
  );
};

export function UploadForm({
  formAction,
  state,
  pending,
}: {
  formAction: any;
  state: UploadStateType;
  pending: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <form action={formAction}>
        <input type="file" id="file" name="file" multiple />
        <Button type="submit" disabled={pending}>
          {pending ? "Pending..." : "Upload"}
        </Button>
        <p>Upload your files</p>
      </form>
      {state?.status && (
        <div className={`state-message ${state.status}`}>{state.message}</div>
      )}
      <div id="files-upload-success" aria-live="polite" aria-atomic="true">
        <p className="mt-2 text-sm text-red-500">{state.message}</p>
      </div>
    </div>
  );
}
