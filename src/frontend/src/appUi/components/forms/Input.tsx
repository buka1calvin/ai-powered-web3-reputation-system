import React, { ComponentProps, forwardRef } from "react";

interface InputProps extends ComponentProps<"input"> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, ...props }, ref) => {
    return (
      <div className="h-fit w-full flex flex-col">
        {label && (
          <label className="font-semibold text-sm">{label}</label>
        )}
        <input
          {...props}
          ref={ref}
          placeholder={props.placeholder}
          className={`bg-white focus:border-primaryBlueColor focus:border-2 focus:outline-none autofill:off  focus:border-opacity-50 border max-h-9 border-gray-700 rounded-sm py-2 px-4 block  w-full h-full appearance-none leading-normal
          ${error ? "border-red-500 border " : ""}`}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
