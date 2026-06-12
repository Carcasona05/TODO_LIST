import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import API from "../../services/api";
import React from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
     
    try {
      await API.post("/auth/register", { name, email, password });

      Alert.alert("Success", "Account created!");
      router.push("/login");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Failed");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Name" onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/login")} style={styles.button}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  button: {
  backgroundColor: "#3b82f6",
  padding: 14,
  borderRadius: 8,
  alignItems: "center",
  marginBottom: 10,
},

buttonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},
};