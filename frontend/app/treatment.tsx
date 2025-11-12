import React, { useMemo } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { colors } from "@/constants/theme";
import Card from "@/components/Card";
import Divider from "@/components/Divider";
import { DISEASE_LIBRARY } from "@/constants/mock";

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={{ marginTop: 8, gap: 8 }}>
      {items.map((t, idx) => (
        <View key={idx} style={{ flexDirection: "row", gap: 8 }}>
          <Text style={{ fontWeight: "900", color: colors.primaryDark }}>•</Text>
          <Text style={{ flex: 1, color: colors.text, fontWeight: "600", lineHeight: 20 }}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

export default function TreatmentScreen() {
  const params = useLocalSearchParams<{ diseaseKey?: string }>();
  const diseaseKey = params.diseaseKey ?? "healthy";
  const disease = useMemo(() => DISEASE_LIBRARY.find((d) => d.key === diseaseKey), [diseaseKey]);

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>{disease?.name ?? "Treatment"}</Text>

      <Card>
        <Text style={styles.h}>Treatment</Text>
        <BulletList items={disease?.treatment ?? ["No data"]} />

        <Divider />

        <Text style={styles.h}>Prevention</Text>
        <BulletList items={disease?.prevention ?? ["No data"]} />

        <Text style={styles.note}>Note: For chemical treatments, follow local agricultural guidance.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 22, fontWeight: "900", color: colors.text, marginBottom: 12 },
  h: { fontSize: 16, fontWeight: "900", color: colors.text },
  note: { marginTop: 12, color: colors.mut, fontWeight: "700", fontSize: 12 },
});
