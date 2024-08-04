import { Button } from "@/app/ui/components/button";
import {
  CloudUploadIcon,
  FileIcon,
  TrashIcon,
  XIcon,
} from "@/app/ui/profile/icons";

type UploadStateType = {
  status: JSX.Element;
  message: string;
  filesUploaded: { fileName: string; fileSize: number }[];
};

export function UploadInstructions() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg border border-muted">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Upload Files</h3>
        <p className="text-muted-foreground">
          Drag and drop your files here or click to select from your device.
        </p>
      </div>
      <div className="w-full max-w-md border-2 border-dashed border-muted rounded-lg p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors hover:border-primary">
        <CloudUploadIcon className="w-10 h-10 text-muted-foreground" />
        <p className="text-muted-foreground">Drag and drop files here</p>
        <input type="file" className="hidden" />
      </div>
    </div>
  );
}

export function UploadedFilesList({ state }: { state: UploadStateType }) {
  return (
    <div className="w-full max-w-md space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">Uploaded Files</p>
        <Button variant="ghost" size="icon">
          <TrashIcon className="w-5 h-5 text-muted-foreground" />
          <span className="sr-only">Clear all</span>
        </Button>
      </div>
      <div className="divide-y divide-muted/20">
        {state.filesUploaded &&
          state.filesUploaded.map(
            (file: { fileName: string; fileSize: number }, index: number) => (
              <UploadedFileItem key={index} file={file} />
            )
          )}
      </div>
    </div>
  );
}

type FileType = {
  fileName: string;
  fileSize: number;
};

function UploadedFileItem({ file }: { file: FileType }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <FileIcon className="w-5 h-5 text-muted-foreground" />
        <div className="flex flex-col">
          <p className="font-medium truncate">{file.fileName}</p>
          <p className="text-xs text-muted-foreground">
            {file.fileSize > 1024 * 1024
              ? `${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`
              : `${(file.fileSize / 1024).toFixed(2)} KB`}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <XIcon className="w-5 h-5 text-muted-foreground" />
        <span className="sr-only">Remove</span>
      </Button>
    </div>
  );
}
