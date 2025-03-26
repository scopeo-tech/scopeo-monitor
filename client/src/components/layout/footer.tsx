"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { contactUs } from "@/lib/api";
import { useState } from "react";
import { FaNpm } from "react-icons/fa";
import { AiOutlineInstagram } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";
import SuccessModal from "../modal/successModal";

const Footer: React.FC = () => {
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); 

  const mutation = useMutation({
    mutationFn: contactUs,
    onSuccess: () => {
      setShowModal(true); 
      formik.resetForm();
    },
    onError: () => {
      setError("Failed to send message. Please try again.");
    },
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("First name is required"),
      lastname: Yup.string().required("Last name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values) => {
      setError(""); 
      mutation.mutate(values);
    },
  });

  return (
    <footer className="w-full">
      {/* Top Section - Contact Form */}
      <div className="bg-emerald-100 h-auto flex flex-col md:flex-row items-center justify-between py-10 px-4 md:px-20 space-y-8 md:space-y-0">
        {/* Left Side - Heading Section */}
        <div className="flex flex-col items-center md:items-start space-y-5 w-full md:w-auto text-center md:text-left">
          <h1 className="text-4xl md:text-8xl font-bold text-emerald-500">
            GET IN <br /> TOUCH
          </h1>
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-500">Scopeo</h1>
        </div>

        {/* Right Side - Form */}
        <form 
          onSubmit={formik.handleSubmit} 
          className="flex flex-col space-y-4 w-full md:w-1/3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstname"
                placeholder="Firstname"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-2 border-emerald-500 p-3 rounded-2xl w-full"
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <p className="text-red-500 text-sm">{formik.errors.firstname}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="lastname"
                placeholder="Lastname"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-2 border-emerald-500 p-3 rounded-2xl w-full"
              />
              {formik.touched.lastname && formik.errors.lastname && (
                <p className="text-red-500 text-sm">{formik.errors.lastname}</p>
              )}
            </div>
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-emerald-500 p-3 rounded-2xl w-full"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          <textarea
            name="message"
            placeholder="Message"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border-2 border-emerald-500 p-3 rounded-2xl w-full"
          ></textarea>
          {formik.touched.message && formik.errors.message && (
            <p className="text-red-500 text-sm">{formik.errors.message}</p>
          )}

          {/* Display Success or Error Message */}
          {error && <p className="text-red-600">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-600 transition self-start"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Bottom Section - Footer Content */}
      <div className="bg-emerald-500 text-white py-6 px-4 md:px-10 flex flex-col">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-3 mb-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-7 h-7"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 8-8 8-3.59 8-8 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Scopeo</h1>
        </div>

        {/* Main Content Below */}
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0">
          <div className="mr-0 md:mr-10 text-center md:text-left">
            <p className="text-lg">Effortless project tracking and</p>
            <p className="text-lg">monitoring for seamless growth</p>
            <p className="text-lg">and success.</p>
          </div>

          <div className="flex flex-col space-y-2 text-center md:text-left md:ml-24 mb-4 md:mb-0">
            <a href="/documentation" className="text-lg font-semibold hover:underline">Documentation</a>
            <a href="/about" className="text-lg font-semibold hover:underline">About Us</a>
            <a href="/contact" className="text-lg font-semibold hover:underline">Contact</a>
          </div>

          <div className="max-w-sm text-center md:text-left md:ml-24 mb-4 md:mb-0">
            <p className="text-white text-lg max-w-sm">
              Stay ahead with smart project <br /> monitoring—insights and <br /> updates, right at your fingertips.
            </p>
          </div>

          <div className="md:ml-24 text-center md:text-left">
            <h1 className="text-white text-xl font-semibold mb-2">FOLLOW US</h1>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href=""><FaNpm className="text-white text-2xl hover:text-gray-300 transition" /></a>
              <a href=""><AiOutlineInstagram className="text-white text-2xl hover:text-gray-300 transition" /></a>
              <a href=""><FaGithub className="text-white text-2xl hover:text-gray-300 transition" /></a>
            </div>
          </div>

          <div className="md:ml-24 text-center md:text-left">
            <h1 className="text-white text-xl font-semibold mb-2">CONTACT US</h1>
            <a href="mailto:scopeo.tech@gmail.com" className="text-white text-lg hover:underline">scopeo.tech@gmail.com</a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="bg-emerald-500 text-white text-center py-3 text-sm mt-4">
          © {new Date().getFullYear()} Scopeo. All rights reserved.
        </div>
      </div>

      {showModal && <SuccessModal onClose={() => setShowModal(false)} isOpen={true} message="Message sent successfully!" />}
    </footer>
  );
};

export default Footer;