"use client";

import { useRef } from "react";

interface OtpModalProps {
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  handleVerifyOtp: () => void;
  onClose: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ email, otp, setOtp, handleVerifyOtp, onClose }) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Allow only digits
    const otpArray = otp.split("");
    otpArray[index] = value;
    setOtp(otpArray.join(""));

    // Move to next input box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to move focus back
  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-3">Enter OTP sent to {email}</h2>
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={otp[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
        <button
          onClick={handleVerifyOtp}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Verify OTP
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
