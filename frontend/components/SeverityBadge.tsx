import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/theme";
import type { Severity } from "@/constants/mock";

const map: Record<Severity, { bg: string; fg: string }> = {
  Low: { bg: "#ECFDF5", fg: colors.success },
  Medium: { bg: "#FFFBEB", fg: colors.warn },
  High: { bg: "#FEF2F2", fg: colors.danger },
};

export default function SeverityBadge({ severity }: { severity: Severity }) {
  const s = map[severity] ?? map.Low;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg, borderColor: s.fg }]}>
      <Text style={[styles.text, { color: s.fg }]}>Severity: {severity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: { fontWeight: "900" },
});
