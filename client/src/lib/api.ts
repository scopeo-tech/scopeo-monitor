import axiosInstance from "./util/axiosInstance"; 
import axios from "axios";
import { Project, userDetails } from "./interface";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true,
});



//authentication

export const loginUser = async (data: { username?: string; email?: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};


export const registerUser =async(data:{username: string, email: string, password: string}) => {
    const response = await api.post("/auth/register", data)
    return response.data
}

export const logoutUser =async() => {
    const response = await api.post("/auth/logout")
    console.log(response.data);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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


//get user info
export const getUserInfo = async (): Promise<userDetails> => {
    const response = await axiosInstance.get("/user/info");
    return response.data.Data; 
};

//get user projects
export const getUserProjects = async (): Promise<Project[]> => {
    const response = await axiosInstance.get("/user/list");
    return response.data.data; 
};


export const getUserProjectCount = async (): Promise<number> => {
    const response = await axiosInstance.get("user/project/count");
    return response.data.data;
}


//create project

 export const createProject = async (data: { name: string; apiKey: string; passKey: string; notificationStatus: boolean }):Promise<Project> => {
    const response = await axiosInstance.post("/project/create-project",data);
    console.log(response.data);
    return response.data;
  };

export const getApiKey = async () => {
    const response = await axiosInstance.get("/project/api-key");
    console.log(response.data);
    return response.data;
  };

export const getPassKey = async () => {
    const response = await axiosInstance.get("/project/pass-key");
    console.log(response.data);
    return response.data;
  };

  export const getProjectPassKey = async (data: { projectId: string }) =>  {
    const response = await axiosInstance.get(`/project/get-project-passkey/${data.projectId}`, { params: data });
    console.log(response.data.data);
    return response.data.data;
  };


  export const updateProject = async (projectId: string, data: { name: string; passKey: string }) => {
    const response = await axiosInstance.put(`/project/update-project/${projectId}`, data);
    console.log(response.data);
    return response.data;
}; 


export const checkProjectName = async ( name: string ) => {
  const response = await axiosInstance.get(`/project/check-project-name/${name}`);
  console.log(response.data.data);
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await axiosInstance.delete(`/project/delete-project/${projectId}`);
  console.log(response.data);
  return response.data;
};



 

