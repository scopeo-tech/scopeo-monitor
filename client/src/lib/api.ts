import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export const loginUser =async(data:{email: string, password: string}) => {
    const response = await api.post("/auth/login", {data})
    return response.data
}

export const registerUser =async(data:{name: string, email: string, password: string}) => {
    const response = await api.post("/auth/register", {data})
    return response.data
}