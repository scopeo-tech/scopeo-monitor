import React from "react";

const FloatingCircle: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`rounded-full absolute  ${className} floating-circle`} />
  );
};

export default FloatingCircle;
