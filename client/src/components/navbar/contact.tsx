"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { contactUs } from "@/lib/api";
import Image from "next/image";
import LoadingButton from "../ui/loadingButton";
import SuccessModal from "../modal/successModal";
import website from "@/assets/website.svg";

const ContactPage = () => {
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const mutation = useMutation({
    mutationFn: contactUs,
    onSuccess: () => {
      setShowSuccessModal(true);
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
    <div className="min-h-screen flex flex-col">
      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          isOpen={true}
          message="Message sent successfully!"
        />
      )}

      {/* Hero Section */}
      <section
        className="relative text-center text-black bg-cover bg-center"
        style={{ backgroundImage: 'url("")' }}
      >
        <div className="container mx-auto px-4 relative z-10 mb-6 mt-6">
          <h1 className="text-4xl font-bold ">Contact us</h1>
          <p className="text-lg">
            Get in touch and let us know how we can help.
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 mb-12 px-5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row ">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Get in touch</h2>
            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel
              neque vitae nulla adipiscing elit.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-emerald-500 text-white p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold">Head Office</h3>
                  <p className="text-gray-600 ">
                    12121 Somewhere World Rd 22
                    <br />
                    City, State
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-500 text-white p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold">Email us</h3>
                  <p className="text-gray-600">scopeotech@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-500 text-white p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold">Call us</h3>
                  <p className="text-gray-600">
                    Phone: +1 (123) 456-7890
                    <br />
                    &nbsp;
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={website}
                    alt="website"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-100 opacity-50 -z-10 rounded-full"></div>
            <div className="absolute bottom-16 right-16 w-16 h-16 bg-green-100 opacity-50 -z-10 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-emerald-500 py-16 bg-gradient-to-br from-emerald-500 to-emerald-600 mb-96">
        <div className="container mx-auto px-4 h-36">
          <div className="text-center text-white mb-8">
            <h2 className="text-3xl font-bold mb-2">Send us a message</h2>
            <p className="max-w-xl mx-auto text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel
              neque, lacinia nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
          </div>

          <div className="bg-white p-8 rounded shadow-lg max-w-2xl mx-auto">
            {error && (
              <div className=" text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="border hover:border-emerald-500 p-3 rounded-2xl w-full"
                    {...formik.getFieldProps("firstname")}
                  />
                  {formik.touched.firstname && formik.errors.firstname && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.firstname}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="border hover:border-emerald-500 p-3 rounded-2xl w-full"
                    {...formik.getFieldProps("lastname")}
                  />
                  {formik.touched.lastname && formik.errors.lastname && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.lastname}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="border hover:border-emerald-500  p-3 rounded-2xl w-full"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Message"
                  className="border p-3 hover:border-emerald-500 rounded-2xl w-full h-32"
                  {...formik.getFieldProps("message")}
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.message}
                  </p>
                )}
              </div>
              
              <div className=" flex justify-center text-center">
                <LoadingButton
                  type="submit"
                  isLoading={mutation.isPending}
                  className="bg-emerald-500 text-white py-3 px-6 rounded transition"
                >
                  SEND MESSAGE
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
