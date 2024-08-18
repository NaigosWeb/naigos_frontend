import axios from "axios";


export const http = axios.create({
    baseURL: "https://api.naigos.cn/", // 请求的基础URL
    // baseURL: "http://localhost:8000/", // 请求的基础URL
    timeout: 5000, //请求超时时间, 自行设置
    withCredentials: true // 解决服务器设置token到cookies中，浏览器Application的cookies中没有存入token
})