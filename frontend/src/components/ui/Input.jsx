import React from "react";
import { motion } from "framer-motion";

const Input = React.forwardRef(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = "left",
      size = "md",
      variant = "default",
      fullWidth = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    };

    const variantClasses = {
      default:
        "border-gray-300 focus:border-primary-500 focus:ring-primary-500",
      success:
        "border-success-300 focus:border-success-500 focus:ring-success-500",
      error: "border-error-300 focus:border-error-500 focus:ring-error-500",
      warning:
        "border-warning-300 focus:border-warning-500 focus:ring-warning-500",
    };

    const inputClasses = `
    block
    ${fullWidth ? "w-full" : ""}
    rounded-lg border
    bg-white
    shadow-sm
    placeholder-gray-400
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[error ? "error" : variant]}
    ${icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <motion.div
        className="space-y-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div
              className={`absolute inset-y-0 ${
                iconPosition === "left" ? "left-0 pl-3" : "right-0 pr-3"
              } flex items-center pointer-events-none`}
            >
              <span className="text-gray-400 text-sm">{icon}</span>
            </div>
          )}

          <input ref={ref} className={inputClasses} {...props} />
        </div>

        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}

        {error && (
          <motion.p
            className="text-xs text-error-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";

export default Input;
