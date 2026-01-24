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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/theme";

const AUTH_REGISTERED_USERS_KEY = "dummy_registered_users"; // optional demo storage

type DummyUser = {
  id: number;
  name: string;
  email: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onRegister() {
    setError(null);

    const n = name.trim();
    const e = email.trim().toLowerCase();

    if (!n || !e || !pw || !cpw) {
      const msg = "Please fill all required fields.";
      setError(msg);
      Alert.alert("Missing info", msg);
      return;
    }
    if (!isValidEmail(e)) {
      const msg = "Please enter a valid email address.";
      setError(msg);
      Alert.alert("Invalid email", msg);
      return;
    }
    if (pw.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setError(msg);
      Alert.alert("Weak password", msg);
      return;
    }
    if (pw !== cpw) {
      const msg = "Passwords do not match.";
      setError(msg);
      Alert.alert("Password mismatch", msg);
      return;
    }

    setLoading(true);
    try {
      // ✅ Dummy register: store locally (optional)
      const raw = await AsyncStorage.getItem(AUTH_REGISTERED_USERS_KEY);
      const list: DummyUser[] = raw ? JSON.parse(raw) : [];

      const exists = list.some((u) => u.email === e);
      if (exists) {
        const msg = "This email is already registered (dummy).";
        setError(msg);
        Alert.alert("Already registered", msg);
        return;
      }

      const user: DummyUser = { id: Date.now(), name: n, email: e };
      await AsyncStorage.setItem(AUTH_REGISTERED_USERS_KEY, JSON.stringify([user, ...list]));

      Alert.alert("Success", "Account created (dummy)!");
      router.replace("/(auth)/login");
    } catch (err: any) {
      const msg = err?.message || "Something went wrong.";
      setError(msg);
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
          {/* Header / Branding */}
          <View style={styles.hero}>
            <View style={styles.logoPlaceholder}>
              <Ionicons name="leaf" size={38} color="#fff" />
            </View>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Get started with SmartTea</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Field label="FULL NAME" value={name} onChange={setName} placeholder="Your name" />
            <Field
              label="EMAIL"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
            />
            <Field label="PASSWORD" value={pw} onChange={setPw} placeholder="••••••••" secure />
            <Field label="CONFIRM PASSWORD" value={cpw} onChange={setCpw} placeholder="••••••••" secure />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
              onPress={onRegister}
              disabled={loading}
            >
              <Text style={styles.primaryBtnText}>{loading ? "Creating..." : "Create Account"}</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ALREADY HAVE AN ACCOUNT?</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace("/(auth)/login")}>
              <Text style={styles.secondaryBtnText}>Back to Login</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  secure,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  keyboardType?: "default" | "email-address";
}) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        style={styles.input}
        value={value}
        onChangeText={onChange}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={!!secure}
        keyboardType={keyboardType ?? "default"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: 16, paddingBottom: 28 },

  hero: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginTop: 6,
    marginBottom: 12,
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primary || "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },

  title: { fontSize: 22, fontWeight: "900", color: colors.text },
  subtitle: { fontSize: 14, color: colors.mut, fontWeight: "700", marginTop: 6, textAlign: "center" },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
  },

  inputWrapper: {
    marginBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#aaa",
    letterSpacing: 1,
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    paddingVertical: 6,
  },

  errorText: { color: "#ff4444", fontSize: 12, fontWeight: "700", marginTop: 2, marginBottom: 10 },

  primaryBtn: {
    backgroundColor: "#111",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  divider: { flex: 1, height: 1, backgroundColor: "#eee" },
  dividerText: { marginHorizontal: 10, fontSize: 11, color: "#aaa", fontWeight: "800" },

  secondaryBtn: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnText: { color: colors.text, fontSize: 15, fontWeight: "900" },

  footer: {
    marginTop: 12,
    textAlign: "center",
    color: colors.mut,
    fontWeight: "700",
  },
});
