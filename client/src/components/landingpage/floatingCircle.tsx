import React from "react";

const FloatingCircle: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`rounded-full border-2 absolute border-emerald-600 ${className} floating-circle`} />
  );
};

export default FloatingCircle;
