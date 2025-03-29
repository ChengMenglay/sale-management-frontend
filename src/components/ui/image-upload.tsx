import React, { useEffect, useState } from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Button } from "./button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
interface ImageUploadProps {
  disable: boolean;
  onChange: (value: string) => void;
  onDelete: (value: string) => void;
  value: string;
}
export default function ImageUpload({
  disable,
  onChange,
  onDelete,
  value,
}: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: CloudinaryUploadWidgetResults) => {
    if (
      result.event === "success" &&
      typeof result?.info === "object" &&
      result.info?.secure_url
    ) {
      onChange(result.info.secure_url);
    }
  };
  if (!isMounted) {
    return null;
  }
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.length > 0 && (
          <div className="relative w-[150px] h-[150px] rounded-md overflow-hidden">
            <div className="z-10 absolute top-2 right-2">
              <Button
                onClick={() => onDelete(value)}
                size={"icon"}
                variant={"destructive"}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-md object-cover"
              alt="image product"
              src={value ?? ""}
            />
          </div>
        )}
      </div>
      <CldUploadWidget
        onSuccess={onUpload}
        uploadPreset="nm-demo"
        key={value.length}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              variant={"secondary"}
              disabled={disable}
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-1" />
              Upload image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
