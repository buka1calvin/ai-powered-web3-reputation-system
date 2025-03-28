import { title } from "process";
import React, { FC } from "react";
interface titleProp{
    title:string
}
const Button:FC<titleProp> = ({title}) => {
  return (
    <button className="relative border-2 border-cyan-700 rounded-lg bg-transparent py-2.5 px-5 font-medium text-primary-1 transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-primary-1 before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100 text-cyan-700">
      {title}
    </button>
  );
};

export default Button;
