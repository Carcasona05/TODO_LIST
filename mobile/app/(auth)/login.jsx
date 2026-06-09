import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import API from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      Alert.alert("Success", "Logged in!");
      router.push("/home");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Login failed");
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => router.push("/register")} />
    </View>
  );
}