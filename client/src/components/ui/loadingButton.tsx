import React from "react";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ isLoading, children, ...props }) => {
  return (
    <button
      {...props} 
      disabled={isLoading || props.disabled} 
      className={`px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center gap-2 transition ${
        isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
      } ${props.className}`} 
    >
      {isLoading ? (
        <>
          <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
