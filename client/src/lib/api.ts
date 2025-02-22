
import axios from "axios";
import {userDetails } from "./interface";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true,
});


//authentication

export const loginUser = async(data:{email: string, password: string}) => {
    const response = await api.post("/auth/login", data)
    return response.data
}

export const registerUser =async(data:{username: string, email: string, password: string}) => {
    const response = await api.post("/auth/register", data)
    return response.data
}

export const logoutUser =async() => {
    const response = await api.post("/auth/logout")
    return response.data
}

// Send OTP for registration
export const sendOtpForRegister = async (email: string) => {

    const response = await api.get(`/auth/register/${email}`);
    console.log(response.data);
    return response.data;
};

  
  // Verify OTP
  export const verifyOtp = async (data: { email: string; otp: string }) => {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
  };

 // Google Login
export const googleLogin = async (idToken: string) => {
    const response = await api.post("/auth/google-login", { idToken });
    return response.data;
  };
  