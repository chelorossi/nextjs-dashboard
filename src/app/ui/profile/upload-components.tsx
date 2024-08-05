import { Button } from "@/app/ui/components/button";
import {
  CloudUploadIcon,
  FileIcon,
  TrashIcon,
  XIcon,
} from "@/app/ui/profile/icons";
import { CheckIcon } from "@heroicons/react/20/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type UploadStateType = {
  success: boolean | null;
  message: string;
  filesUploaded: { fileName: string; fileSize: number }[];
};

type FileType = {
  fileName: string;
  fileSize: number;
};

export function UploadInstructions({
  formAction,
  state,
  pending,
  filesDropped,
  setFilesDropped,
}: {
  formAction: any;
  state: UploadStateType;
  pending: boolean;
  filesDropped: any;
  setFilesDropped: any;
}) {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      // Handle the dropped files
      console.log(acceptedFiles);
      setFilesDropped(acceptedFiles);
    },
    [setFilesDropped]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // maxFiles: 1,
    maxSize: 1024 * 1024 * 50, // 5 MB
    onDrop,
  });
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg border border-muted">
      {/* <UploadHeader /> */}
      <div
        {...getRootProps()}
        className="w-full max-w-md border-2 border-dashed border-muted rounded-lg p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors hover:border-primary"
      >
        <input
          {...getInputProps()}
          type="file"
          id="file"
          name="file"
          multiple
        />
        <CloudUploadIcon className="w-10 h-10 text-muted-foreground" />
        <p className="text-muted-foreground">Drag and drop files here</p>
      </div>
      <div className="flex w-full gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 text-white bg-black"
        >
          Choose Files
        </Button>
        <Button
          type="submit"
          variant="outline"
          className="flex-1 text-white bg-black"
          disabled={pending}
        >
          {pending ? "Pending..." : "Upload"}
        </Button>
      </div>
      <FilesList
        filesUploaded={
          state?.filesUploaded?.map((file: any) => file.fileName) ?? []
        }
        filesDropped={filesDropped}
        setFilesDropped={setFilesDropped}
      />
    </div>
  );
}

function UploadHeader() {
  return (
    <div className="text-center space-y-2">
      <h3 className="text-2xl font-bold">Upload Files</h3>
      <p className="text-muted-foreground">
        Drag and drop your files here or click to select from your device.
      </p>
    </div>
  );
}

export function FilesList({
  filesUploaded,
  filesDropped,
  setFilesDropped,
}: {
  filesUploaded: any;
  filesDropped: any;
  setFilesDropped: any;
}) {
  function handleClearFiles(event: any): void {
    event.preventDefault();
    setFilesDropped([]);
  }

  function handleRemoveFile(event: any, index: number) {
    event.preventDefault();
    setFilesDropped((prevFiles: any) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1);
      return newFiles;
    });
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">Uploaded Files</p>
        <Button variant="ghost" size="icon">
          <TrashIcon
            className="w-5 h-5 text-muted-foreground"
            onClick={handleClearFiles}
          />
          <span className="sr-only">Clear all</span>
        </Button>
      </div>
      <div className="divide-y divide-muted/20">
        {filesDropped.map((file: any, index: number) => (
          <FileItem
            key={index}
            file={{ fileName: file.name, fileSize: file.size }}
            onClick={(event: any) => handleRemoveFile(event, index)}
            includeCheck={filesUploaded.includes(file.name)}
            wrapTextLength={38}
          />
        ))}
      </div>
    </div>
  );
}

function FileItem({
  file,
  onClick,
  includeCheck,
  wrapTextLength,
}: {
  file: FileType;
  onClick: any;
  includeCheck: boolean;
  wrapTextLength: number;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <FileIcon className="w-5 h-5 text-muted-foreground" />
        <div className="flex flex-col">
          <p className="font-medium truncate">
            {file.fileName.length > wrapTextLength
              ? `${file.fileName.substring(0, wrapTextLength)} ...`
              : file.fileName}
          </p>
          <p className="text-xs text-muted-foreground">
            {file.fileSize > 1024 * 1024
              ? `${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`
              : `${(file.fileSize / 1024).toFixed(2)} KB`}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        disabled={includeCheck}
        onClick={onClick}
      >
        {includeCheck ? (
          <CheckIcon className="w-5 h-5 text-green-500" />
        ) : (
          <XIcon className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
