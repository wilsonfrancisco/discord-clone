"use cliente"

import { FileIcon, X } from "lucide-react"
import Image from "next/image"
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
  const fileType = value.split(".").pop()

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="uploaded server image" className="rounded-full" />
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
        <a
          target="_blank"
          rel="noopener noreferer"
          href={value}
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

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