"use client";

import { useState } from "react";
import { User } from "@/lib/interface";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";


const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setUser = useAuthStore((state) => state.setUser);
    const router = useRouter()


    const handleLogin = async (data: { email: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await loginUser(data);
            const { user } = response as { user: User };  
            setUser(user)
            router.push("/home")
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }

}

return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex w-3/4 max-w-4xl shadow-md rounded-lg overflow-hidden">
        {/* Left Side - Welcome Message */}
        <div className="w-1/2 bg-green-500 text-white flex flex-col items-center justify-center p-10 rounded-l-lg">
          <h2 className="text-3xl font-medium mb-6">Welcome Back</h2>
          <p className="text-center mb-1">
            To stay connected with us
          </p>
          <p className="text-center mb-14">
            Please login with your credentials
          </p>
          
          <p className="mt-8 mb-4">Don&apos;t have an account?</p>
          <button className="px-8 py-2 border border-white rounded-full text-white hover:bg-white hover:text-green-500 transition w-64">
            Register now
          </button>
        </div>
  
        {/* Right Side - Login Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-medium text-green-500 mb-8">Login</h2>
  
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              email: Yup.string().email("Invalid email").required("Required"),
              password: Yup.string().required("Required"),
            })}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col space-y-6">
                {/* Email Field */}
                <div className="relative">
                  <FaUser className="absolute left-0 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Field
                    name="email"
                    type="email"
                    placeholder="username / email"
                    className="w-full pl-6 pb-2 border-b border-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
  
                {/* Password Field */}
                <div className="relative">
                  <FaLock className="absolute left-0 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Field
                    name="password"
                    type="password"
                    placeholder="password"
                    className="w-full pl-6 pb-2 border-b border-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>
  
                {/* Forgot Password */}
                <div className="text-right text-sm text-gray-400 cursor-pointer hover:text-green-500 mt-2">
                  Forgot Password?
                </div>
  
                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition mt-4"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>
  
          {/* OR Divider */}
          <div className="flex items-center justify-center my-6">
            <span className="px-3 text-gray-400 text-sm">or</span>
          </div>
  
          {/* Google Login Button */}
          <button className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-full text-gray-700 hover:bg-gray-50 transition">
            <FcGoogle className="mr-2 text-lg" /> Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm