"use client";

import Image from "next/image";
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
    if (!/^\d?$/.test(value)) return; 
    const otpArray = otp.split("");
    otpArray[index] = value;
    setOtp(otpArray.join(""));
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  
  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[500] h-[500]px">
        <div className="flex justify-center">
        <Image src="https://i.pinimg.com/736x/a1/35/a1/a135a1a05d33f466290a880e6d20e95e.jpg" alt="Logo" width={250} height={10} />
        </div>
        <h2 className="text-lg font-semibold mb-3 ">Verify your email</h2>
       
        <p className="mb-4">Please enter the 6 digit code sent to {email}</p>
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={otp[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-10 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
            />
          ))}
        </div>
        <div>
        <div className="flex justify-between gap-6">
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Verify OTP
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default OtpModal;
