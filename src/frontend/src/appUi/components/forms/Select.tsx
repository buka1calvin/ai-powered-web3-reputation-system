import React from "react";
import Select, { GroupBase, Props } from "react-select";

interface SelectWithErrorProps {
  label?: string;
  isSearchable?: boolean;
  name?: string;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
  [x: string | number | symbol]: unknown;
}

export interface IOption {
  label: string;
  value: string;
}
export default function SelectWithErrorCustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group> & SelectWithErrorProps) {
  return (
    <div className="w-full">
      {props.label && (
        <label className="font-semibold text-sm" htmlFor={props.id}>
          {props.label}
        </label>
      )}
      <Select
        {...props}
        styles={{
          control: (baseStyles: object) => ({
            ...baseStyles,
            borderColor: !props.error ? "grey" : "red",
            borderRadius: "4px",
            boxShadow: "none",
            "&:hover": {
              cursor: "pointer"
            }
          }),

          valueContainer: (base: object) => ({
            ...base,
            textTransform: "capitalize"
          }),
          option: (base) => ({
            ...base,
            textTransform: "capitalize",
            backgroundColor: "transparent",
            color: "black",
            "&:hover": {
              backgroundColor: "#E5E3D4",
              cursor: "pointer",
            }
          }),
          indicatorSeparator: () => ({
            display: "none"
          }),

        }}
      />

      {props.error && <p className="text-red-500 text-xs">{props.error}</p>}
    </div>
  );
}
