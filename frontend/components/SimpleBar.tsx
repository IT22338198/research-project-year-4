import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";

export default function SimpleBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.max(0, Math.min(1, value / max));

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct * 100}%` }]} />
      </View>
      <Text style={styles.val}>{Math.round(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  label: { width: 110, color: colors.text, fontWeight: "800" },
  track: { flex: 1, height: 10, borderRadius: 999, backgroundColor: "#E8EEF5", overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.info },
  val: { width: 36, textAlign: "right", color: colors.mut, fontWeight: "800" },
});
