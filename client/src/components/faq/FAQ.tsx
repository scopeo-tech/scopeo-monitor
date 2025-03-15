import Image from "next/image";
import React from "react";
import faqIcon from "../../assets/faqIcon.png";

const FAQ = () => {
  return (
    <div className="px-5 md:px-20 overflow-y-hidden">
      <div className="flex flex-col-reverse md:flex-row items-center">
        
        <div className="w-full md:w-1/2 mt-10">
          <div className="mb-6 md:mb-16">
            <h1 className="text-[#16C47F] text-3xl md:text-4xl font-bold">
              Frequently Asked
            </h1>
            <h1 className="text-[#16C47F] text-3xl md:text-4xl font-bold">
              Questions
            </h1>
          </div>

          <div className="mb-6 md:mb-16">
            <input
              type="text"
              className="w-full md:w-96 border-[3px] rounded-full h-10 px-6 py-5 border-[#16C47F] focus:outline-2 focus:outline-[#1ea56f] text-sm md:text-base"
              placeholder="Search Questions here"
            />
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-lg font-semibold">How to change password?</h4>
              <p className="text-gray-500 text-sm">Go to settings and update your password.</p>
            </div>
            <h4 className="text-lg font-semibold">How to change Email?</h4>
            <h4 className="text-lg font-semibold">How to change username?</h4>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <Image width={500} height={500} src={faqIcon} alt="FAQ Icon" className="max-w-[80%] md:max-w-[100%]" />
        </div>

      </div>
    </div>
  );
};

export default FAQ;
