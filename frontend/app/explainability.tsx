import React, { useMemo, useState } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";
import { colors } from "@/constants/theme";
import Card from "@/components/Card";
import Divider from "@/components/Divider";
import SimpleBar from "@/components/SimpleBar";
import { DISEASE_LIBRARY } from "@/constants/mock";

export default function ExplainabilityScreen() {
  const params = useLocalSearchParams<{ diseaseKey?: string }>();
  const diseaseKey = params.diseaseKey ?? "healthy";
  const disease = useMemo(() => DISEASE_LIBRARY.find((d) => d.key === diseaseKey), [diseaseKey]);

  const [rain, setRain] = useState(20);
  const [humidity, setHumidity] = useState(20);
  const [spots, setSpots] = useState(20);

  const whatIfText = useMemo(() => {
    const effect = Math.round((humidity * 0.6 + rain * 0.4 + spots * 0.9) * 0.6);
    return `If rainfall/humidity/leaf spots increase, disease risk may increase by ~${effect}% (estimate).`;
  }, [rain, humidity, spots]);

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Why this result?</Text>

      <Card>
        <Text style={styles.h}>Main Reasons (Visual)</Text>
        <Text style={styles.mut}>Simple explanation (no technical terms).</Text>

        <View style={{ marginTop: 12 }}>
          {(disease?.featureImpact ?? []).map((f) => (
            <SimpleBar key={f.name} label={f.name} value={f.value} />
          ))}
        </View>

        <Text style={styles.explain}>
          Example: Higher rainfall and humidity often help leaf diseases spread faster.
        </Text>

        <Divider />

        <Text style={styles.h}>What-if (Simple Sliders)</Text>

        <View style={styles.sliderBox}>
          <Text style={styles.sliderLabel}>Rainfall</Text>
          <Slider minimumValue={0} maximumValue={100} value={rain} onValueChange={setRain} />
          <Text style={styles.sliderValue}>{Math.round(rain)}%</Text>
        </View>

        <View style={styles.sliderBox}>
          <Text style={styles.sliderLabel}>Humidity</Text>
          <Slider minimumValue={0} maximumValue={100} value={humidity} onValueChange={setHumidity} />
          <Text style={styles.sliderValue}>{Math.round(humidity)}%</Text>
        </View>

        <View style={styles.sliderBox}>
          <Text style={styles.sliderLabel}>Leaf Spots</Text>
          <Slider minimumValue={0} maximumValue={100} value={spots} onValueChange={setSpots} />
          <Text style={styles.sliderValue}>{Math.round(spots)}%</Text>
        </View>

        <Text style={styles.whatif}>{whatIfText}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 22, fontWeight: "900", color: colors.text, marginBottom: 12 },
  h: { fontSize: 16, fontWeight: "900", color: colors.text },
  mut: { color: colors.mut, fontWeight: "600", marginTop: 6 },
  explain: { marginTop: 8, color: colors.text, fontWeight: "600", lineHeight: 20 },
  sliderBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
  },
  sliderLabel: { fontWeight: "900", color: colors.text, marginBottom: 6 },
  sliderValue: { marginTop: 6, color: colors.mut, fontWeight: "800" },
  whatif: { marginTop: 12, fontWeight: "800", color: colors.info },
});
