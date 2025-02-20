"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { registerUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import { User } from "@/lib/interface";
import * as Yup from "yup";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(data);
      const { user } = response as { user: User };
      setUser(user);
      router.push("/home");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex w-3/4 max-w-5xl rounded-lg overflow-hidden shadow-lg">
        {/* Left Side - Illustration */}
        <div className="w-1/2 bg-green-500 p-6 relative">
          <Image
            src="https://i.pinimg.com/736x/ef/ec/17/efec17aac3e7cf1478fc871fe80306f9.jpg"
            alt="Data visualization illustration"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-medium text-green-500 mb-6">Sign up</h2>

          <Formik
            initialValues={{ username: "", email: "", password: "", confirmPassword: "", terms: false }}
            validationSchema={Yup.object({
              username: Yup.string().required("Required"),
              email: Yup.string().email("Invalid email").required("Required"),
              password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords must match")
                .required("Required"),
              terms: Yup.boolean().oneOf([true], "You must accept the terms"),
            })}
            onSubmit={(values) => handleRegister({ name: values.username, email: values.email, password: values.password })}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col space-y-5">
                {/* Username Field */}
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Field name="username" type="text" placeholder="Username" className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500" />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Field name="email" type="email" placeholder="Email" className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500" />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Field name="password" type="password" placeholder="Password" className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500" />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Field name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-green-500" />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center">
                  <Field name="terms" type="checkbox" className="mr-2 form-checkbox text-green-500 focus:ring-green-500" />
                  <label className="text-sm text-gray-500">I Agree To The Terms & Conditions</label>
                  <ErrorMessage name="terms" component="div" className="text-red-500 text-sm ml-2" />
                </div>

                {error && <div className="text-red-500 text-sm">{error}</div>}

                {/* Register Button */}
                <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition" disabled={isSubmitting || loading}>
                  {loading ? "Registering..." : "Register"}
                </button>

                {/* OR Divider */}
                <div className="flex items-center justify-center my-2">
                  <span className="px-3 text-gray-400 text-sm">or</span>
                </div>

                {/* Google Login Button */}
                <button type="button" className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-full text-gray-700 hover:bg-gray-50 transition">
                  <FcGoogle className="mr-2 text-lg" /> Login with Google
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

