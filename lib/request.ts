import axios, { AxiosError } from "axios";
import { ResponseProps } from "@/models/Response";
import { showToast } from "./utils";

// 扩展 AxiosRequestConfig 类型
declare module "axios" {
  interface AxiosRequestConfig {
    skipErrorHandle?: boolean;
  }
}

// 创建一个 axios 实例
const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 60000, // 设置请求超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 可以在这里添加请求头或其他配置

    return config;
  },
  error => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  (error: AxiosError<ResponseProps>) => {
    console.log(error);

    // 获取请求配置
    const config = error.config;

    // 统一处理错误
    if (error.response) {
      // 如果设置了跳过错误处理，直接返回错误
      if (config?.skipErrorHandle) {
        return Promise.reject(error.response?.data);
      }

      // 服务器返回的错误
      if (error.response?.data.showType === "error") {
        showToast.error(error.response?.data.message);
      }
      if (error.response?.data.showType === "warning") {
        showToast.success(error.response?.data.message);
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      if (error.code === "ECONNABORTED") {
        showToast.error(error.message || "请求超时");
      }
      // 请求未收到响应
      console.error("Error Request:", error.request);
    } else {
      // 其他错误
      console.error("Error Message:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
