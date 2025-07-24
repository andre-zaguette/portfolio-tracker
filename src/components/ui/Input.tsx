import { InputHTMLAttributes } from "react";

type Props = {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, error, className, ...props }: Props) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium">{label}</label>}
      <input
        {...props}
        className={`w-full border rounded px-3 py-2 bg-neutral-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
