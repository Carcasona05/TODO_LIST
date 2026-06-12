import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  // Change your IP according to your IPV4
  baseURL: "http://192.168.1.37:3000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default API;