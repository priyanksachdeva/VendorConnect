import React from "react";

const ProtectedRoute = ({ children }) => {
  // Temporarily bypass authentication for testing
  return children;
};

export default ProtectedRoute;
