import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./LoginScreen.styles";
import { loginUser } from "../../../services/auth.service";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  onLoginSuccess: () => void;
};

export default function LoginScreen({ onLoginSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      await loginUser(email, password);
      // Replace with real auth logic
      Alert.alert("Login Successful", `Welcome, ${email}`);

      onLoginSuccess();
    } catch (e) {
      Alert.alert("Login failed", e as string);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.passwordIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword && <Feather name="eye-off" size={20} color="black" />}
            {!showPassword && <Feather name="eye" size={20} color="black" />}
          </TouchableOpacity>
        </View>

        <Pressable style={styles.button} disabled={isLoading} onPress={onLogin}>
          <Text style={styles.buttonText}>
            {isLoading ? "Logging in" : "Sign In"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
