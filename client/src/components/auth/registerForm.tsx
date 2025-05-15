/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { googleLogin, sendOtpForRegister, verifyOtp, registerUser } from "@/lib/api";
import OtpModal from "../modal/otpModal";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { getSession, signIn, useSession } from "next-auth/react";
import { User } from "@/lib/interface";
import axios from "axios";
import Link from "next/link";
import signup from "@/assets/signup.svg";
import { useUserStore } from "@/lib/stores/userStore";

const RegisterForm: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const user = useUserStore((state) => state.user);

  const { data: session, status } = useSession();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && user) {
      router.push("/home");
    }
  }, [hydrated, user, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.idToken) {
      handleGoogleLogin(session?.idToken);
    }
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn("google", { redirect: false }).then(async (response) => {
        if (!response?.error) {
          const updatedSession = await getSession();
          if (updatedSession?.idToken) {
            await handleGoogleLogin(updatedSession?.idToken);
          }
        } else {
          setError(response?.error);
        }
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      const response = await googleLogin(idToken);
      const { user, token } = response as { user: User; token: string };
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        useUserStore.getState().setUser(user);
        router.push("/home");
      }
    } catch (error) {
      setError((error as Error).message);
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.message?.includes("Expiration time")
      ) {
        return;
      }
      console.error("Google login failed", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const handleGetOtp = async (
    email: string,
    setErrors: (errors: Record<string, string>) => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      await sendOtpForRegister(email);
      setUserEmail(email);
      setIsOtpModalOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || "Registration failed";
        if (message.includes("User already exists")) {
          setErrors({ email: "User already exists, please log in." });
        } else {
          setError(message);
        }
      } else {
        setError("Network error, please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await verifyOtp({ email: userEmail, otp });
      setIsOtpVerified(true);
      setIsOtpModalOpen(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (
    data: {
      username: string;
      email: string;
      password: string;
    },
    setErrors: (errors: Record<string, string>) => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(data);
      router.push("/auth/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const message = err.response.data?.message || "Registration failed";
        if (message.includes("Username already exists")) {
          setErrors({ username: "Username already exists" });
        } else if (message.includes("Email already exists")) {
          setErrors({ email: "User already exists, please log in." });
        } else if (message.includes("Email not verified")) {
          setErrors({ email: "Email not verified. Please verify your OTP." });
        } else {
          setError(message);
        }
      } else {
        setError("Network error, please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex w-3/4 max-w-5xl rounded-lg overflow-hidden shadow-lg">
        <div className="w-1/2 bg-emerald-50 p-6 relative">
          <Image
            src={signup}
            alt="Data visualization illustration"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-medium text-emerald-500 mb-6">
            Sign up
          </h2>

          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
              terms: false,
            }}
            validationSchema={Yup.object({
              username: Yup.string().required("Required"),
              email: Yup.string().email("Invalid email").required("Required"),
              password: Yup.string()
                .min(8, "Must be at least 8 characters")
                .required("Required"),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords must match")
                .required("Required"),
              terms: Yup.boolean().oneOf([true], "You must accept the terms"),
            })}
            onSubmit={async (values, { setErrors }) => {
              if (!isOtpVerified) {
                await handleGetOtp(values.email, setErrors);
              } else {
                await handleRegister(
                  {
                    username: values.username,
                    email: values.email,
                    password: values.password,
                  },
                  setErrors
                );
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col">
                <div className="relative ">
                  <div className="relative flex items-center ">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                    <Field
                      name="username"
                      type="text"
                      placeholder="Username"
                      className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="h-[20px] relative">
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="text-red-500 text-sm absolute -bottom-5"
                    />
                    {error && (
                      <div className="text-red-500 text-sm text-start absolute -bottom-5">
                        {error}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative flex items-center mb-5">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm absolute -bottom-5"
                  />
                </div>

                <div className="relative flex items-center mb-5">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    className="absolute right-0 text-gray-500 hover:text-gray-700 mr-4"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm absolute -bottom-5"
                  />
                </div>

                <div className="relative flex items-center mb-5">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm absolute -bottom-5"
                  />
                </div>

                <div className="flex items-center mb-5">
                  <Field
                    name="terms"
                    type="checkbox"
                    className="mr-2 form-checkbox text-emerald-500 focus:ring-emerald-500"
                  />
                  <label className="text-sm text-gray-500">
                    I Agree To The Terms & Conditions
                  </label>
                  <ErrorMessage
                    name="terms"
                    component="div"
                    className="text-red-500 text-sm ml-2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-3 rounded-full hover:bg-emerald-600 transition"
                  disabled={isSubmitting || loading}
                >
                  {isOtpVerified ? "Register" : "Get OTP"}
                </button>

                <div className="flex items-center justify-center my-2">
                  <span className="px-3 text-gray-400 text-sm">or</span>
                </div>

                <button
                  onClick={handleSignIn}
                  type="button"
                  className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-full text-gray-700 hover:bg-gray-50 transition"
                >
                  <FcGoogle className="mr-2 text-lg" /> Login with Google
                </button>

                <p className="mt-6 text-center text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-emerald-500 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {isOtpModalOpen && (
        <OtpModal
          email={userEmail}
          otp={otp}
          setOtp={setOtp}
          handleVerifyOtp={handleVerifyOtp}
          onClose={() => setIsOtpModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RegisterForm;
