import React from "react";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  icon,
  className = "",
  ...props
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-success-100 text-success-800",
    error: "bg-error-100 text-error-800",
    warning: "bg-warning-100 text-warning-800",
    accent: "bg-accent-100 text-accent-800",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  };

  const classes = `
    inline-flex items-center
    font-medium rounded-full
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <span className={classes} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
