import React, { useMemo } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { colors } from "@/constants/theme";
import Card from "@/components/Card";
import Divider from "@/components/Divider";
import SeverityBadge from "@/components/SeverityBadge";
import AppButton from "@/components/AppButton";
import { DISEASE_LIBRARY } from "@/constants/mock";

type ResultParams = {
  diseaseKey?: string;
  confidence?: string;     // "0.9079" (from API) OR undefined (mock)
  probabilities?: string;  // JSON string: {"brown_blight":..., ...}
};

export default function ResultScreen() {
  const params = useLocalSearchParams<ResultParams>();

  const diseaseKey = params.diseaseKey ?? "healthy";

  // Find disease info from your local library (names, severity, summary)
  const disease = useMemo(
    () => DISEASE_LIBRARY.find((d) => d.key === diseaseKey),
    [diseaseKey]
  );

  // If API confidence passed (0..1), use it; else fallback to mock confidence
  const apiConfidence = params.confidence ? Number(params.confidence) : null;
  const confidencePct =
    apiConfidence !== null && !Number.isNaN(apiConfidence)
      ? Math.round(apiConfidence * 100)
      : null;

  const fallbackConfidence =
    disease?.severity === "High" ? 92 : disease?.severity === "Medium" ? 84 : 78;

  // Parse probabilities JSON safely
  const probs = useMemo(() => {
    if (!params.probabilities) return null;
    try {
      const obj = JSON.parse(params.probabilities);
      if (obj && typeof obj === "object") return obj as Record<string, number>;
      return null;
    } catch {
      return null;
    }
  }, [params.probabilities]);

  // Show top 3 probabilities sorted
  const topProbs = useMemo(() => {
    if (!probs) return null;
    const entries = Object.entries(probs)
      .filter(([, v]) => typeof v === "number" && !Number.isNaN(v))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    return entries;
  }, [probs]);

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Detection Result</Text>

      <Card>
        <Text style={styles.h}>Detected</Text>
        <Text style={styles.big}>{disease?.name ?? diseaseKey}</Text>

        <SeverityBadge severity={disease?.severity ?? "Low"} />

        <Text style={styles.mut}>
          Confidence: {confidencePct !== null ? `${confidencePct}%` : `${fallbackConfidence}%`}
        </Text>

        {topProbs && (
          <>
            <Divider />
            <Text style={styles.h}>Probabilities</Text>

            <View style={{ marginTop: 10, gap: 8 }}>
              {topProbs.map(([k, v]) => (
                <View key={k} style={styles.probRow}>
                  <Text style={styles.probKey}>{k}</Text>
                  <Text style={styles.probVal}>{Math.round(v * 100)}%</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <Divider />

        <Text style={styles.h}>Summary</Text>
        <Text style={styles.body}>{disease?.summary ?? "No summary available."}</Text>

        <AppButton
          title="Treatment & Prevention"
          onPress={() => router.push({ pathname: "/treatment", params: { diseaseKey } })}
          style={{ marginTop: 12 }}
        />
        <AppButton
          title="Why this result?"
          variant="secondary"
          onPress={() => router.push({ pathname: "/explainability", params: { diseaseKey } })}
          style={{ marginTop: 10 }}
        />
        <AppButton
          title="Scan Another"
          variant="secondary"
          onPress={() => router.back()}
          style={{ marginTop: 10 }}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: 16, paddingBottom: 28 },

  title: { fontSize: 22, fontWeight: "900", color: colors.text, marginBottom: 12 },
  h: { fontSize: 16, fontWeight: "900", color: colors.text },

  big: { fontSize: 26, fontWeight: "900", color: colors.text, marginTop: 8, marginBottom: 10 },
  mut: { color: colors.mut, fontWeight: "700", marginTop: 8 },

  body: { color: colors.text, fontWeight: "600", marginTop: 6, lineHeight: 20 },

  probRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  probKey: { fontWeight: "900", color: colors.text },
  probVal: { fontWeight: "900", color: colors.primaryDark },
});
