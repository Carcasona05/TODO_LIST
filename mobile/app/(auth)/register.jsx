import { View, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import API from "../../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
     
    try {
      await API.post("/auth/register", { email, password });

      Alert.alert("Success", "Account created!");
      router.push("/login");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed");
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}