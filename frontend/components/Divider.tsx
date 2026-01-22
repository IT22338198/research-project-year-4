import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors } from "@/constants/theme";

export default function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.div, style]} />;
}

const styles = StyleSheet.create({
  div: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
});
