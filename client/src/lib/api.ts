import axios from "axios";
import {userDetails } from "./interface";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true,
});


//authentication

export const loginUser =async(data:{email: string, password: string}) => {
    const response = await api.post("/auth/login", {data})
    return response.data
}

export const registerUser =async(data:{name: string, email: string, password: string}) => {
    const response = await api.post("/auth/register", {data})
    return response.data
}

export const logoutUser =async() => {
    const response = await api.post("/auth/logout")
    return response.data
}

//userData

export const getUserData =async(): Promise<userDetails> => {
    const response = await api.get<userDetails>("/user/info")
    console.log(response.data)
    return response.data
}