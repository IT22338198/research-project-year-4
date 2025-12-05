import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/theme";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

const DUMMY_EMAIL = "admin@gmail.com";
const DUMMY_PASSWORD = "admin123";

export default function BrandedLogin() {
  const [form, setForm] = useState({ email: DUMMY_EMAIL, password: DUMMY_PASSWORD });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      if (email !== DUMMY_EMAIL || password !== DUMMY_PASSWORD) {
        const msg = "Invalid dummy credentials. Use admin@gmail.com / admin123";
        setError(msg);
        Alert.alert("Login failed", msg);
        return;
      }

      await AsyncStorage.setItem(AUTH_TOKEN_KEY, "dummy_token_123");
      await AsyncStorage.setItem(
        AUTH_USER_KEY,
        JSON.stringify({ id: 1, name: "Admin", email: DUMMY_EMAIL, role: "admin" })
      );

      Alert.alert("Success", "Logged in!");
      router.replace("/(tabs)");
    } catch (e: any) {
      const msg = e?.message || "Something went wrong.";
      setError(msg);
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.inner}>
          <View style={styles.headerSection}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="leaf" size={40} color="#fff" />
            </View>
            <Text style={styles.title}>SmartTea</Text>
            <Text style={styles.subtitle}>Fast, simple predictions for tea growers.</Text>
          </View>

          <View style={styles.form}>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
              <Text style={styles.inputLabel}>EMAIL</Text>
              <TextInput
                placeholder="admin@gmail.com"
                placeholderTextColor="#aaa"
                style={styles.input}
                value={form.email}
                onChangeText={(t) => setForm({ ...form, email: t })}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                placeholder="admin123"
                placeholderTextColor="#aaa"
                secureTextEntry
                style={styles.input}
                value={form.password}
                onChangeText={(t) => setForm({ ...form, password: t })}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>{loading ? "Checking..." : "Sign In"}</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
              Dummy login: <Text style={styles.hintStrong}>{DUMMY_EMAIL}</Text> /{" "}
              <Text style={styles.hintStrong}>{DUMMY_PASSWORD}</Text>
            </Text>
            <TouchableOpacity style={styles.footer} onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.footerText}>
              New here? <Text style={styles.signUpText}>Create account</Text>
            </Text>
          </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, paddingHorizontal: 30, justifyContent: "center" },
  headerSection: { alignItems: "center", marginBottom: 40 },

  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary || "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },

  title: { fontSize: 28, fontWeight: "800", color: "#111", letterSpacing: 0.5 },
  subtitle: { fontSize: 16, color: "#666", marginTop: 4, textAlign: "center" },

  form: { width: "100%" },

  inputWrapper: {
    marginBottom: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#aaa",
    letterSpacing: 1,
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    paddingVertical: 5,
  },
  inputError: { borderBottomColor: "#ff4444" },

  errorText: { color: "#ff4444", fontSize: 12, marginBottom: 10, fontWeight: "600" },

  loginButton: {
    backgroundColor: "#111",
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

footer: { marginTop: 26, alignItems: "center" },
  footerText: { color: "#666", fontSize: 14, fontWeight: "500" },
  signUpText: { color: colors.primary || "#6366f1", fontWeight: "700" },

  hint: {
    marginTop: 14,
    textAlign: "center",
    color: "#9aa0a6",
    fontWeight: "700",
    fontSize: 12,
  },
  hintStrong: { color: "#111", fontWeight: "900" },
});
