"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import faqImage1 from "../../assets/faqImage1.svg";
import faqImage2 from "../../assets/faqImage2.svg";
import faqImage3 from "../../assets/faqImage3.svg";
import faqImage4 from "../../assets/faqImage4.svg";

import { Faq } from "@/lib/interface";
import {
  getTopFaqs,
  searchFaqs,
  getAISuggestion,
  getAIGeneratedFaq,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/lib/hooks/useDebounce";

const FAQ = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiFaq, setAiFaq] = useState<{
    question: string;
    answer: string;
  } | null>(null);

  const images = [faqImage1, faqImage2, faqImage3, faqImage4];
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: topFaqs, isLoading: topFaqsLoading } = useQuery({
    queryKey: ["topFaqs"],
    queryFn: getTopFaqs,
    enabled: !debouncedQuery,
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["searchFaqs", debouncedQuery],
    queryFn: () => searchFaqs(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  const handleGenerateAIAnswer = async () => {
    if (!debouncedQuery || searchResults?.results.length > 0) return;
    setLoadingAi(true);
    try {
      const result = await getAIGeneratedFaq(debouncedQuery);
      setAiFaq(result);
    } catch {
      setAiFaq(null);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      getAISuggestion(debouncedQuery)
        .then(setAiSuggestion)
        .catch(() => setAiSuggestion(""));
    } else {
      setAiSuggestion("");
    }
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Tab" || e.key === "ArrowRight") && aiSuggestion) {
      e.preventDefault();
      const fullSuggestion = searchQuery + aiSuggestion;
      setSearchQuery(fullSuggestion);
      setAiSuggestion("");
    }
  };

  const faqs: Faq[] = debouncedQuery
    ? searchResults?.results || []
    : topFaqs?.data || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  
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

          <div className="mb-6 md:mb-16 relative">
            <div className="relative">
              <input
                type="text"
                className="w-full md:w-96 border-[3px] rounded-full h-10 px-6 py-5 border-[#16C47F] focus:outline-2 focus:outline-[#1ea56f] text-sm md:text-base"
                placeholder="Search Questions here"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setAiFaq(null);
                }}
                onKeyDown={handleKeyDown}
              />

              {aiSuggestion && (
                <div className="absolute top-[11px] left-0.5 pointer-events-none flex items-center">
                  <div className="px-6 truncate">
                    <span className="text-transparent">{searchQuery}</span>
                    <span className="text-gray-400">{aiSuggestion}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {searchLoading || topFaqsLoading ? (
              <p className="text-gray-500">Loading FAQs...</p>
            ) : faqs.length > 0 ? (
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

                  <AnimatePresence>
                    {(hoveredId === faq._id || clickedId === faq._id) && (
                      <motion.p
                        className="text-gray-600 text-sm mt-2 p-2 bg-gray-100 rounded-md"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : aiFaq ? (
              <div className="border-b border-gray-300 pb-2">
                <h4 className="text-lg font-semibold">{aiFaq.question}</h4>
                <motion.p
                  className="text-gray-600 text-sm mt-2 p-2 bg-gray-100 rounded-md"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {aiFaq.answer}
                </motion.p>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <p className="text-gray-500">No FAQs available.</p>
                <button
                  onClick={handleGenerateAIAnswer}
                  className="bg-[#16C47F] text-white px-4 py-2 rounded-md hover:bg-[#14a96d] transition"
                  disabled={loadingAi}
                >
                  {loadingAi ? "Generating..." : "Generate AI Answer"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-start items-end md:mt-16 relative h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              className="absolute top-0 right-0 w-full h-full flex justify-end"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.1, 0.25, 1.0],
                opacity: { duration: 0.5 }
              }}
            >
              <Image
                width={500}
                height={500}
                src={images[currentImageIndex]}
                alt={`FAQ Image ${currentImageIndex + 1}`}
                className="max-w-[80%] md:max-w-[100%] object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FAQ;