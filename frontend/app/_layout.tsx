import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleStyle: { fontWeight: "900" } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="result" options={{ title: "Result" }} />
      <Stack.Screen name="treatment" options={{ title: "Treatment & Prevention" }} />
      <Stack.Screen name="explainability" options={{ title: "Why this result?" }} />
      <Stack.Screen name="history/[id]" options={{ title: "History Detail" }} />
      <Stack.Screen name="predict-yield" options={{ title: "Predict Yield" }} />
      <Stack.Screen name="predict-price" options={{ title: "Predict Price" }} />
    </Stack>
  );
}
