"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { TbPhotoPlus } from "react-icons/tb";

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload = ({ onChange, value }: ImageUploadProps) => {
  const handleUpload = (result: any) => {
    const url = result?.info?.secure_url;

    if (url) {
      onChange(url);
    } else {
      console.error("URL을 찾을 수 없습니다.", result);
    }
  };

  return (
    <CldUploadWidget
      onSuccess={(result) => {
        handleUpload(result);
      }}
      uploadPreset={uploadPreset}
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        return (
          <div
            onClick={() => open()}
            className={`relative flex flex-col ${
              value && "h-[500px]"
            } items-center justify-center gap-4
            p-20 transition border-2 border-dashed cursor-pointer hover:opacity-70
            border-neutral-300 text-neutral-600`}
          >
            <TbPhotoPlus size={50} />
            {value && (
              <div className="absolute inset-0 w-full h-full">
                <Image
                  fill
                  style={{ objectFit: "contain" }}
                  src={value}
                  alt="House"
                />
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;
