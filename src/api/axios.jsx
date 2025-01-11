import axios from "axios";
import userInfoStore from "../stores/userInfoStore";

export const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

// 기본 인스턴스
export const basicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 인증이 필요한 인스턴스
export const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `bearer ${localStorage.getItem("accessToken") || ""}`,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// formData 처리를 위한 인스턴스
export const formDataAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `bearer ${localStorage.getItem("accessToken") || ""}`,
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

// 요청 인터셉터 설정 (authAxios)
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 요청 인터셉터 설정 (formDataAxios)
formDataAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (토큰 만료 시 처리)
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { clearUserInfo } = userInfoStore.getState();
      clearUserInfo();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default basicAxios;
