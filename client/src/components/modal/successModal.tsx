import { FC } from "react";
import { CheckCircleIcon } from "lucide-react"; 

interface SuccessModalProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: FC<SuccessModalProps> = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
        <p className="mt-4 text-lg font-semibold text-gray-700">{message}</p>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
