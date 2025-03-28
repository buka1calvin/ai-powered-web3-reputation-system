import React, { ComponentProps } from "react";

interface HeadingProps extends ComponentProps<"h1"> {
  children: React.ReactNode;
  subTitle?: string;
  subTitleClassName?: string;
}
export default function Heading({
  children,
  subTitle,
  subTitleClassName,
  className,
}: HeadingProps) {
  return (
    <div>
      <h1
        className={`text-5xl md:text-xl leading-4 font-bold text-largeTextColor ${className}`}
      >
        {children}
      </h1>
      {subTitle && (
        <p
          className={`text-gray-400 font-serif mt-1 text-md leading-4 ${subTitleClassName}`}
        >
          {subTitle}
        </p>
      )}
    </div>
  );
}
