// import { ButtonHTMLAttributes } from "react";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   bgColor?: string;
//   textColor?: string;
//   hoverColor?: string;
// }

// export default function Button({
//   children,
//   bgColor = "bg-blue-600",
//   textColor = "text-white",
//   hoverColor = "hover:bg-blue-700",
//   className = "",
//   disabled,
//   ...props
// }: ButtonProps) {
//   return (
//     <button
//       className={`
//         px-4 py-2
//         rounded-md
//         font-medium
//         transition-colors
//         duration-200
//         ${bgColor}
//         ${textColor}
//         ${hoverColor}
//         ${disabled ? "opacity-50 cursor-not-allowed" : ""}
//         ${className}
//       `}
//       disabled={disabled}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// }
