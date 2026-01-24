import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { colors } from "@/constants/theme";
import Card from "@/components/Card";
import AppButton from "@/components/AppButton";
import Divider from "@/components/Divider";
import { API_BASE } from "@/constants/api";

type LeafApiResponse = {
  ok: boolean;
  prediction: string; // "gray_blight" | "brown_blight" | "healthy"
  confidence: number; // 0..1
  probabilities?: Record<string, number>;
};

export default function ScanScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState<LeafApiResponse | null>(null);

  async function pickFromGallery() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow gallery access.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!res.canceled) {
      setImageUri(res.assets[0]?.uri ?? null);
      setApiResult(null);
    }
  }

  async function openCamera() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
    });

    if (!res.canceled) {
      setImageUri(res.assets[0]?.uri ?? null);
      setApiResult(null);
    }
  }

  function uriToFormData(uri: string) {
    const name = uri.split("/").pop() || `leaf_${Date.now()}.jpg`;
    const ext = name.split(".").pop()?.toLowerCase();
    const type = ext === "png" ? "image/png" : "image/jpeg";

    const form = new FormData();
    form.append("image", { uri, name, type } as any);
    return form;
  }

  async function predictLeaf() {
    if (!imageUri) {
      Alert.alert("No image", "Please select or take a photo.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/predict/leaf`, {
        method: "POST",
        body: uriToFormData(imageUri),
      });

      const data = (await res.json()) as LeafApiResponse;

      if (!res.ok || !data.ok) {
        Alert.alert("Prediction failed", JSON.stringify(data));
        return;
      }

      setApiResult(data);

      router.push({
        pathname: "/result",
        params: {
          diseaseKey: data.prediction,
          confidence: String(data.confidence),
          probabilities: data.probabilities
            ? JSON.stringify(data.probabilities)
            : "",
        },
      });
    } catch (e: any) {
      Alert.alert("Network error", e?.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Scan / Predict</Text>
      <Text style={styles.sub}>Capture or upload a leaf image</Text>

      <Card>
        <Text style={styles.h}>Leaf Image</Text>
        <Text style={styles.mut}>
          Use a clear image with good lighting and focus.
        </Text>

        <View style={styles.previewBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImg} />
          ) : (
            <Text style={{ color: colors.mut, fontWeight: "900" }}>
              No image selected
            </Text>
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <AppButton title="Open Camera" onPress={openCamera} />
          <AppButton
            title="Gallery"
            variant="secondary"
            onPress={pickFromGallery}
          />
        </View>

        <AppButton
          title={loading ? "Predicting..." : "Predict Disease"}
          onPress={predictLeaf}
          style={{ marginTop: 12 }}
          disabled={loading}
        />

        {loading && (
          <View style={{ marginTop: 10, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ color: colors.mut, fontWeight: "700", marginTop: 6 }}>
              Sending image to AI model...
            </Text>
          </View>
        )}

        {apiResult && (
          <>
            <Divider />
            <Text style={{ color: colors.mut, fontWeight: "700" }}>
              Last result: {apiResult.prediction} (
              {Math.round(apiResult.confidence * 100)}%)
            </Text>
          </>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 22, fontWeight: "900", color: colors.text },
  sub: { color: colors.mut, fontWeight: "700", marginTop: 4, marginBottom: 12 },
  h: { fontSize: 16, fontWeight: "900", color: colors.text },
  mut: { color: colors.mut, fontWeight: "600", marginTop: 6 },
  previewBox: {
    marginTop: 12,
    height: 230,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImg: { width: "100%", height: "100%" },
});
