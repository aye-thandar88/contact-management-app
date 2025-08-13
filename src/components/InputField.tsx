import React from "react";
import type { FieldError } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  requiredStar?: boolean;
  error?: FieldError;
}

export const InputField = ({
  label,
  name,
  requiredStar = false,
  error,
  ...props
}: InputFieldProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
        {label} {requiredStar && <span className="text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        {...props}
        className={`border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 `}
      />

      {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
    </div>
  );
};
