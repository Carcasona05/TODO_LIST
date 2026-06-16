import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

const router = useRouter();

const API = axios.create({
  // Change your IP according to your IPV4
  baseURL: "http://192.168.1.37:3000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

API.interceptors.response.use(
  (res) => res, async (error) => {
    const status = error.response?.status;

    if (status == 401 ){
      await AsyncStorage.removeItem("token");

      Alert.alert(
        "Session expire",
        "Please log in first"
      );
      router.replace("/(auth)/login"); 
    }
    return Promise.reject(error);
  }
);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;