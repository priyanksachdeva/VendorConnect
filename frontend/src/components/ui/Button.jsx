import React from "react";
import { motion } from "framer-motion";

const buttonVariants = {
  primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-soft",
  secondary: "bg-secondary-600 hover:bg-secondary-700 text-white shadow-soft",
  accent: "bg-accent-600 hover:bg-accent-700 text-white shadow-soft",
  success: "bg-success-600 hover:bg-success-700 text-white shadow-soft",
  error: "bg-error-600 hover:bg-error-700 text-white shadow-soft",
  warning: "bg-warning-600 hover:bg-warning-700 text-white shadow-soft",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 bg-white",
  ghost: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
  link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline",
};

const sizeVariants = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : ""}
    ${buttonVariants[variant]}
    ${sizeVariants[size]}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    const content = (
      <>
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"
            />
          </svg>
        ) : icon && iconPosition === "left" ? (
          <span className="mr-2">{icon}</span>
        ) : null}

        {children}

        {icon && iconPosition === "right" && !loading ? (
          <span className="ml-2">{icon}</span>
        ) : null}
      </>
    );

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        onClick={onClick}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
