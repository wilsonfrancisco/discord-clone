"use cliente"

import { UploadDropzone } from "@/lib/uploadthing"

interface FileUploadProps {
  onChange: (url?: string) => void,
  value: string
  endpoint: "messageFile" | "serverImage"
}

export const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  onChange,
  value
}) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => { }}
    />
  );
}