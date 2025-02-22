const OtpModal = ({ email, otp, setOtp, handleVerifyOtp, onClose }: any) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-medium mb-4">Enter OTP sent to {email}</h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full"
            placeholder="Enter OTP"
          />
          <button onClick={handleVerifyOtp} className="bg-green-500 text-white px-4 py-2 mt-4 rounded">Verify OTP</button>
          <button onClick={onClose} className="ml-4 text-gray-500">Cancel</button>
        </div>
      </div>
    );
  };
  
  export default OtpModal;
  