import axiosInstance from "./util/axiosInstance";
import axios from "axios";
import { Project, userDetails } from "./interface";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

//authentication

export const loginUser = async (data: {
  username?: string;
  email?: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  console.log(response.data);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return response.data;
};

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
  console.log(response.data.data);
  return response.data.data;
};

export const getUserProjectCount = async (): Promise<number> => {
  const response = await axiosInstance.get("user/project/count");
  return response.data.data;
};

//create project

export const createProject = async (data: {
  name: string;
  apiKey: string;
  passKey: string;
  notificationStatus: boolean;
}): Promise<Project> => {
  const response = await axiosInstance.post("/project/create-project", data);
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

export const getProjectPassKey = async (projectId: string) => {
  const response = await axiosInstance.get(
    `/project/get-project-passkey/${projectId}`
  );
  console.log(response.data.data);
  return response.data.data;
};

export const getProjectById = async (projectId: string) => {
  const response = await axiosInstance.get(`/user/project/${projectId}`);
  console.log(response.data);
  return response.data.data;
};

export const updateProject = async (
  projectId: string,
  data: { name: string; passKey: string }
) => {
  const response = await axiosInstance.put(
    `/project/update-project/${projectId}`,
    data
  );
  console.log(response.data);
  return response.data;
};

export const checkProjectName = async (name: string) => {
  const response = await axiosInstance.get(
    `/project/check-project-name/${name}`
  );
  console.log(response.data.data);
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await axiosInstance.delete(
    `/project/delete-project/${projectId}`
  );
  console.log(response.data);
  return response.data;
};

export const updateProfile = async (data: {
  username: string;
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await axiosInstance.put("/user/update-profile", data);
  console.log(response.data);
  return response.data;
};

export const checkUsername = async (username: string) => {
  const response = await axiosInstance.get(`/user/check/${username}`);
  return response.data;
};

export const deleteProfile = async (userId: string) => {
  const response = await axiosInstance.delete(`/user/delete-profile/${userId}`);
  console.log(response.data);
  return response.data;
};
// security stats

export const allLogins = async (projectId: string, timeFilter: string) => {
  const response = await axiosInstance.get(
    `/project/get-total-logins/${projectId}?timeFilter=${timeFilter}`
  );
  return response.data;
};

export const failedLogins = async (projectId: string, timeFilter: string) => {
  const response = await axiosInstance.get(
    `/project/get-failed-logins/${projectId}?timeFilter=${timeFilter}`
  );
  return response.data;
};

export const unususalLogin = async (projectId: string, timeFilter: string) => {
  const response = await axiosInstance.get(
    `/project/get-unusual-logins/${projectId}?timeFilter=${timeFilter}`
  );
  return response.data;
};

export const bruteForceLogin = async (
  projectId: string,
  timeFilter: string
) => {
  const response = await axiosInstance.get(
    `/project/get-brute-force/${projectId}?timeFilter=${timeFilter}`
  );
  return response.data;
};

export const securityStats = async (
  projectId: string,
  timeFilter: string
) => {
  const response = await axiosInstance.get(
    `/project/get-security-stats/${projectId}?timeFilter=${timeFilter}`
  );
  return response.data.stats;
}

// error stats
export const errorStats = async (projectId: string, filter: string) => {
  const response = await axiosInstance.get(`/project/get-error-stats/${projectId}`, {
    params: { filter },
  });
  return response.data;
};

export const commonErros = async (projectId: string, filter: string) => {
  const response = await axiosInstance.get(`/project/get-error-common/${projectId}`, {
    params: { filter },
  });
  return response.data;
};

export const latestErrors = async (projectId: string, filter: string) => {
  const response = await axiosInstance.get(`/project/get-error-latest/${projectId}`, {
    params: { filter },
  });
  return response.data;
};

export const errorMethods = async (projectId: string, filter: string) => {
  const response = await axiosInstance.get(`/project/get-error-method/${projectId}`, {
    params: { filter },
  });
  return response.data;
};

export const getAllErrors = async (projectId: string, page: number, limit: number) => {
  const {data} = await axiosInstance.get(`/project/get-all-errors/${projectId}?page=${page}&limit=${limit}`);
  return data;
};


export const getLogs = async (projectId: string, filter: string) => {
  const response = await axiosInstance.get(`/project/get-logs/${projectId}`, {
    params: { filter },
  });
  console.log(response.data);
  return response.data;
}


// perfomance

// Performance Metrics
export const getPerformanceData = async (projectId: string,filter: string) => {
  const response = await axiosInstance.get(`/project/get-performance-data/${projectId}`,{
    params: {filter}
  });
  return response.data;
};

// Server Performance Metrics
export const getServerMetrics = async (projectId: string ,filter: string) => {
  const response = await axiosInstance.get(`/project/get-server-metrics/${projectId}`,{
    params: {filter}
  });
  return response.data;
};

// System Health Metrics
export const getSystemMetrics = async (projectId: string , filter: string) => {
  const response = await axiosInstance.get(`/project/get-system-metrics/${projectId}`,{
    params: {filter}
  });
  return response.data;
};

// Traffic & Load Metrics
export const getTrafficMetrics = async (projectId: string , filter: string) => {
  const response = await axiosInstance.get(`/project/get-traffic-metrics/${projectId}`,{
    params: {filter}
  });
  return response.data;
};

// Error & Stability Metrics
export const getStabilityMetrics = async (projectId: string , filter: string) => {
  const response = await axiosInstance.get(`/project/get-stability-metrics/${projectId}`,{
    params: {filter}
  });
  return response.data;
};
