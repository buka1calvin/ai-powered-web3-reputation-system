import React from "react";
export const Badge = ({
  icon: Icon,
  color,
  text,
}: {
  icon: React.ElementType;
  color: string;
  text: string;
}) => (
  <div
    className={`flex items-center bg-${color}-100 text-${color}-700 px-3 py-1 rounded-full text-sm mr-2 mb-2`}
  >
    <Icon className="mr-1" />
    {text}
  </div>
);
