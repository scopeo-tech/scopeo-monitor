import axios from "axios";
import axiosErrorManager from "./axiosErrorManager";

const axiosInstance = axios.create({
  baseURL: "3000000",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );
        const newAccessToken = response.data.token;

        localStorage.setItem("token", newAccessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Error refreshing token:", err);
        const exists = localStorage.getItem("refreshToken")
        if(exists){
          await axiosInstance.post("auth/logout", {}, { withCredentials: true });
        }
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        return Promise.reject(err);
      }
    }

    console.error("Request failed:", axiosErrorManager(error));
    return Promise.reject(error);
  }
);

export default axiosInstance;