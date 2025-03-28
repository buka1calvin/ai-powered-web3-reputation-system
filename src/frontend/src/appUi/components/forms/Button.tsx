import clsx from "clsx";
import React, { ComponentProps } from "react";
import Loading from "../loading";

interface ButtonProps extends ComponentProps<"button"> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  theme?: "primary" | "secondary" | "none";
  outline?: boolean;
}

export default function Button({
  isLoading,
  loadingText,
  children,
  icon,
  className,
  disabled,
  onClick,
  outline,
  theme = "none",
  ...rest
}: ButtonProps) {
  const getThemeStyles = () => {
    switch (theme) {
      case "primary":
        return {
          base: clsx("text-white bg-co-primary", "border-co-primary"),
          hover: clsx("hover:bg-white hover:text-co-primary"),
        };
      case "secondary":
        return {
          base: clsx("text-white bg-co-secondary", "border-co-secondary"),
          hover: clsx("hover:bg-white hover:text-co-secondary"),
        };
      default:
        return {
          base: clsx("text-co-black bg-transparent", "border-co-gray"),
          hover: clsx("hover:bg-co-black"),
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center gap-1 justify-center",
        "px-4 py-2",
        "text-sm font-bold",
        "transition duration-200 ease-in-out",
        "border-2 rounded-full",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isLoading ? "bg-white flex items-center justify-center" : "",
        outline ? themeStyles.base : "focus:border-co-black",
        outline ? themeStyles.hover : "hover:bg-co-gray",
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );


}
