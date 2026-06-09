import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import API from "../services/api";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { email, password });
      Alert.alert("Success", "Account created!");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed");
    }
  };

  return (
    <View>
      <Text>Register</Text>

      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <Button title="Register" onPress={handleRegister} />
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}