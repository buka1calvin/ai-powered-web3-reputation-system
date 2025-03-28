import React from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { resizeImage } from "../../../utils/resizeImage";

export const ImageDropzone = ({
  name,
  label,
  preview,
  onPreviewChange,
  setValue,
}: {
  name: "profilePic" | "coverPic";
  label: string;
  preview?: string | null;
  onPreviewChange: (preview: string | null) => void;
  setValue: (name: string, value: File) => void;
}) => {
  const profileStyles = {
    wrapper: `relative w-full h-[300px]`,
    coverContainer: `w-full h-[200px] overflow-hidden`,
    coverImage: `w-full h-full object-cover`,
    profileContainer: `absolute left-1/2 -translate-x-1/2 -bottom-16 z-10`,
    profileImage: `w-32 h-32 rounded-full border-4 border-white object-cover z-10`,
    uploadOverlay: `absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer`,
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024,
    onDrop: async (files) => {
      const file = files[0];
      const resizedImage = await resizeImage(file, {
        maxWidth: name === "profilePic" ? 400 : 1200,
        maxHeight: name === "profilePic" ? 400 : 800,
        quality: 0.8,
      });
      setValue(name, resizedImage);
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        onPreviewChange(previewUrl);
      };
      reader.readAsDataURL(resizedImage);
    },
  });

  return (
    <div
      className={
        name === "coverPic"
          ? profileStyles.coverContainer
          : profileStyles.profileContainer
      }
    >
      <div {...getRootProps()} className="relative">
        <input {...getInputProps()} />
        {preview ? (
          <img
            src={preview}
            alt={label}
            className={
              name === "coverPic"
                ? profileStyles.coverImage
                : profileStyles.profileImage
            }
          />
        ) : (
          <div
            className={`${
              name === "coverPic" ? "h-[200px]" : "w-32 h-32 rounded-full"
            } bg-gray-200 flex ring-1 items-center justify-center`}
          >
            <span className="text-gray-500 text-xs text-center">
              Upload {label}
            </span>
          </div>
        )}
        <div className={profileStyles.uploadOverlay}>
          <span className="text-center text-xs">Change {label}</span>
        </div>
      </div>
    </div>
  );
};
