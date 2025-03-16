"use client";
import Image from "next/image";
import React, { useState } from "react";
import faqIcon from "../../assets/faqIcon.png";
import { Faq } from "@/lib/interface";
import { getTopFaqs } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

const FAQ = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["topFaqs"],
    queryFn: getTopFaqs,
  });

  const faqs: Faq[] = data?.data || [];

  return (
    <div className="px-5 md:px-20 overflow-hidden">
      <div className="flex flex-col-reverse md:flex-row gap-10">
        <div className="w-full md:w-1/2 mt-10 min-h-[600px] overflow-hidden">
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

          <div className="space-y-4">
            {isLoading && <p className="text-gray-500">Loading FAQs...</p>}
            {isError && <p className="text-red-500">Failed to load FAQs.</p>}
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="border-b border-gray-300 pb-2"
                  onMouseEnter={() => setHoveredId(faq._id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <h4
                    className="text-lg font-semibold cursor-pointer transition duration-200"
                    onClick={() =>
                      setClickedId(clickedId === faq._id ? null : faq._id)
                    }
                  >
                    {faq.question}
                  </h4>

                  {(hoveredId === faq._id || clickedId === faq._id) && (
                    <motion.p
                      className="text-gray-600 text-sm mt-2 p-2 bg-gray-100 rounded-md"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No FAQs available.</p>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start">
          <Image
            width={500}
            height={500}
            src={faqIcon}
            alt="FAQ Icon"
            className="max-w-[80%] md:max-w-[100%]"
          />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
