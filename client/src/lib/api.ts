import axiosInstance from "./util/axiosInstance";
import axios from "axios";
import { Project, userDetails } from "./interface";


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
  
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return response.data;
};

// Send OTP for registration
export const sendOtpForRegister = async (email: string) => {
  const response = await api.get(`/auth/register/${email}`);
  
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
};

//create project

export const createProject = async (data: {
  name: string;
  apiKey: string;
  passKey: string;
  notificationStatus: boolean;
}): Promise<Project> => {
  const response = await axiosInstance.post("/project/create-project", data);
  
  return response.data;
};

export const getApiKey = async () => {
  const response = await axiosInstance.get("/project/api-key");
  
  return response.data;
};

export const getPassKey = async () => {
  const response = await axiosInstance.get("/project/pass-key");
  
  return response.data;
};

export const getProjectPassKey = async (projectId: string) => {
  const response = await axiosInstance.get(
    `/project/get-project-passkey/${projectId}`
  );
  
  return response.data.data;
};

export const getProjectById = async (projectId: string) => {
  const response = await axiosInstance.get(`/user/project/${projectId}`);
  
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
  
  return response.data;
};

export const checkProjectName = async (name: string) => {
  const response = await axiosInstance.get(
    `/project/check-project-name/${name}`
  );
  
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await axiosInstance.delete(
    `/project/delete-project/${projectId}`
  );
  
  return response.data;
};

export const updateProfile = async (data: {
  username: string;
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await axiosInstance.put("/user/update-profile", data);
  
  return response.data;
};

export const checkUsername = async (username: string) => {
  const response = await axiosInstance.get(`/user/check/${username}`);
  return response.data;
};

export const deleteProfile = async (userId: string) => {
  const response = await axiosInstance.delete(`/user/delete-profile/${userId}`);
  
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


export const getErrorAnalysis = async (errorMessage: string ) => {
  const response = await axiosInstance.post("/project/get-error-analysis", {errorMessage});
  return response.data;
};

export const resolveError = async (id: string) => {
  const response = await axiosInstance.post(`/project/resolve-error/${id}`);
  return response.data;
};

export const unResolveError = async (id: string) => {
  const response = await axiosInstance.post(`/project/unresolve-error/${id}`);
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



//contact
export const contactUs = async (data:{firstname:string,lastname:string,email:string,message:string}) => {
  const response = await axiosInstance.post("/user/contact", data);
  return response.data;
}

//faqs routes

export const getTopFaqs = async () => {
  const response = await api.get("/faq/get-top-faqs");
  return response.data;
};

export const searchFaqs = async (query: string) => {
  const response = await api.get(`/faq/get-search-faqs?query=${query}`);
  return response.data;
};

export const getAISuggestion = async (query: string) => {
  const response = await api.get(`/faq/get-ai-suggestion?query=${query}`);
  return response.data.suggestion;
};

export const getAIGeneratedFaq = async (query: string) => {
  const response = await api.get(`/faq/get-ai-generated-faqs?query=${query}`);
  return response.data.data;
};


export const getNotification = async(projectID: string) => {
  const response = await axiosInstance.get(`/project/get-notifications/${projectID}`);
  return response.data;
};

export const markAsRead = async(projectID: string) => {
  const response = await axiosInstance.post(`/project/mark-as-read/${projectID}`);
  return response.data;
}


//logs

export const getLogs = async (projectId: string, filter: string) => {
  const response = await axiosInstance.get(`/project/get-logs/${projectId}`, {
    params: { filter },
  });
  
  return response.data;
}

export const getRoutesFromDb = async (projectId: string) => {
  const response = await axiosInstance.get(`/project/get-logs-route/${projectId}`);
  return response.data;
}

export const getLogsByRoute = async (projectId: string, route: string) => {
  const response = await axiosInstance.get(`/project/get-logs-by-route/${projectId}?route=${route}`);
  return response.data;
}