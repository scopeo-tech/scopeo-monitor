"use client";

import { useEffect, useState } from "react";
import { User } from "@/lib/interface";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { googleLogin, loginUser } from "@/lib/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FC } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { getSession, signIn, useSession } from "next-auth/react";
import axios from "axios";

const LoginForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.idToken) {
      console.log("Session loaded :", session);
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
      console.log(user, token, "user and token");
      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setUser(user);
        await router.push("/");
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

  const handleLogin = async (data: {
    emailOrUsername: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const isEmail = data.emailOrUsername.includes("@");

      const requestData = isEmail
        ? { email: data.emailOrUsername, password: data.password }
        : { username: data.emailOrUsername, password: data.password };
      const response = await loginUser(requestData);
      const { user } = response as { user: User };
      const { token } = response as { token: string };
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      setUser(user);
      console.log(user);
      console.log("login Succefully");
      router.push("/home");
    } catch (err) {
      setError((err as Error).message);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex w-3/4 max-w-4xl shadow-md rounded-lg overflow-hidden">
        {/* Left Side - Welcome Message */}
        <div className="w-1/2 bg-green-500 text-white flex flex-col items-center justify-center p-10 rounded-l-lg">
          <h2 className="text-3xl font-medium mb-6">Welcome Back</h2>
          <p className="text-center mb-1">To stay connected with us</p>
          <p className="text-center mb-14">
            Please login with your credentials
          </p>

          <p className="mt-8 mb-4">Don&apos;t have an account?</p>
          <button
            className="px-8 py-2 border border-white rounded-full text-white hover:bg-white hover:text-green-500 transition w-64"
            onClick={() => router.push("/auth/register")}
          >
            Register now
          </button>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 p-10 flex flex-col justify-center bg-white">
          <h2 className="text-2xl font-medium text-green-500 mb-8">Login</h2>

          <Formik
            initialValues={{ emailOrUsername: "", password: "" }}
            validationSchema={Yup.object({
              emailOrUsername: Yup.string()
                .test(
                  "email-or-username",
                  "Invalid email or username",
                  (value) => {
                    if (!value) return false;
                    return value.includes("@")
                      ? Yup.string().email().isValidSync(value)
                      : true;
                  }
                )
                .required("Required"),
              password: Yup.string().required("Required"),
            })}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col space-y-6">
                <div className="relative">
                  <FaUser className="absolute left-0 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Field
                    name="emailOrUsername"
                    type="text"
                    placeholder="username / email"
                    className="w-full pl-6 pb-2 border-b border-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-0 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <Field
                    name="password"
                    type="password"
                    placeholder="password"
                    className="w-full pl-6 pb-2 border-b border-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="text-right text-sm text-gray-400 cursor-pointer hover:text-green-500 mt-2">
                  Forgot Password?
                </div>
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
          <div className="flex items-center justify-center my-6">
            <span className="px-3 text-gray-400 text-sm">or</span>
          </div>
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-full text-gray-700 hover:bg-gray-50 transition"
          >
            <FcGoogle className="mr-2 text-lg" /> Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
