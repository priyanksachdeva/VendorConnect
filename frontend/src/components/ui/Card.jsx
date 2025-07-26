import React from "react";
import { motion } from "framer-motion";

const cardVariants = {
  default: "bg-white border border-gray-200 shadow-soft",
  elevated: "bg-white border border-gray-200 shadow-medium",
  outlined: "bg-white border-2 border-gray-200",
  filled: "bg-gray-50 border border-gray-200",
  gradient:
    "bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200",
};

const Card = React.forwardRef(
  (
    {
      children,
      variant = "default",
      padding = "md",
      className = "",
      hover = true,
      ...props
    },
    ref
  ) => {
    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
      xl: "p-10",
    };

    const baseClasses = `
    rounded-xl
    transition-all duration-200 ease-in-out
    ${cardVariants[variant]}
    ${paddingClasses[padding]}
    ${hover ? "hover:shadow-medium hover:-translate-y-1" : ""}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

// Card Sub-components
const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "", ...props }) => (
  <div className={`mt-6 pt-4 border-t border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
