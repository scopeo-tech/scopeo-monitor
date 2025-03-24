import { AIErrorAnalysisResponse } from "@/lib/interface";
import { useEffect } from "react";

const AIAnalysisModal = ({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: AIErrorAnalysisResponse;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white text-black w-[60%] my-12 max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-xl text-black font-bold mb-4 text-center">
          AI Error Analysis
        </h2>

        {data ? (
          <>
            <p className="text-gray-800 mb-4">
              <strong className="text-black">Summary:</strong> {data.summary}
            </p>

            <h4 className="text-lg font-semibold mt-4 mb-2">
              Possible Causes:
            </h4>
            <ul className="list-disc ml-5 text-black space-y-2">
              {data.causes.map((cause: string, index: number) => {
                const cleanedCause = cause.replace(/\*\*/g, "");
                const [title, ...desc] = cleanedCause.split(":");
                return (
                  <li key={index}>
                    <strong className="text-gray-800">{title.trim()}:</strong>{" "}
                    {desc.join(":").trim()}
                  </li>
                );
              })}
            </ul>

            <h4 className="text-lg font-semibold mt-4 mb-2">
              Suggested Fixes:
            </h4>
            <ul className="list-disc ml-5 text-black space-y-2">
              {data.fixes.map((fix: string, index: number) => {
                const cleanedFix = fix.replace(/\*\*/g, "");
                const [title, ...desc] = cleanedFix.split(":");
                return (
                  <li key={index}>
                    <strong className="text-gray-800">{title.trim()}:</strong>{" "}
                    {desc.join(":").trim()}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p className="text-gray-500 text-center">Analyzing error...</p>
        )}

        <button
          className="mt-6 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 w-full font-semibold"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
