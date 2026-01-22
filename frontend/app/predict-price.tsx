import React, { useMemo, useState } from "react";
import { ScrollView, Text, StyleSheet, TextInput, View, ActivityIndicator, Alert } from "react-native";
import { colors } from "@/constants/theme";
import Card from "@/components/Card";
import Divider from "@/components/Divider";
import AppButton from "@/components/AppButton";
import SimpleLineChart from "@/components/SimpleLineChart";
import { API_BASE } from "@/constants/api";

type PriceForm = {
  grade: string;
  rainfall_mm: string;
  temperature_c: string;
  production_kg: string;
  exports_kg: string;
  fuel_index: string;
  inflation_yoy_pct: string;
  prediction_date: string; // YYYY-MM-DD
};

type PredictBody = {
  grade: string;
  overrides: {
    rainfall_mm: number;
    temperature_c: number;
    production_kg: number;
    exports_kg: number;
    fuel_index: number;
    inflation_yoy_pct: number;
    prediction_date: string;
  };
};

type PredictResponse = {
  success: boolean;
  results?: Array<{
    grade: string;
    prediction_date: string;
    prediction_rs_per_kg: number;
    success: boolean;
    // used_overrides exists but we won't show it in UI
    used_overrides?: Record<string, number | string>;
  }>;
};

const gradeOptions = ["BOPF", "BOP", "OP", "Dust", "FBOPF"];

const pill = (active: boolean) => ({
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: active ? colors.primary : colors.border,
  backgroundColor: active ? "#E8FFFE" : "#fff",
});

export default function PredictPriceScreen() {
  const [form, setForm] = useState<PriceForm>({
    grade: "BOPF",
    rainfall_mm: "100",
    temperature_c: "30.5",
    production_kg: "5100",
    exports_kg: "5000",
    fuel_index: "300",
    inflation_yoy_pct: "6.2",
    prediction_date: "2027-04-10",
  });

  const [loadingOne, setLoadingOne] = useState(false);
  const [loading7, setLoading7] = useState(false);

  const [oneResult, setOneResult] = useState<{ price: number; date: string; grade: string } | null>(null);
  const [series7, setSeries7] = useState<{ dates: string[]; prices: number[] } | null>(null);

  const payloadBase: Omit<PredictBody, "overrides"> & { overrides: Omit<PredictBody["overrides"], "prediction_date"> } = useMemo(
    () => ({
      grade: form.grade,
      overrides: {
        rainfall_mm: toNum(form.rainfall_mm),
        temperature_c: toNum(form.temperature_c),
        production_kg: toInt(form.production_kg),
        exports_kg: toInt(form.exports_kg),
        fuel_index: toInt(form.fuel_index),
        inflation_yoy_pct: toNum(form.inflation_yoy_pct),
      },
    }),
    [form]
  );

  async function postPredict(body: PredictBody): Promise<PredictResponse> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as PredictResponse;

    if (!res.ok) throw new Error((data as any)?.message || `HTTP ${res.status}`);
    return data;
  }

  async function predictOne() {
    const date = form.prediction_date?.trim();
    if (!isValidYmd(date)) {
      Alert.alert("Invalid date", "Please enter prediction_date as YYYY-MM-DD (e.g., 2027-04-10).");
      return;
    }

    setLoadingOne(true);
    setOneResult(null);
    setSeries7(null);

    try {
      const body: PredictBody = {
        grade: payloadBase.grade,
        overrides: { ...payloadBase.overrides, prediction_date: date },
      };

      const data = await postPredict(body);

      const r0 = data?.results?.[0];
      if (!data?.success || !r0?.success) {
        Alert.alert("Prediction failed", JSON.stringify(data, null, 2));
        return;
      }

      setOneResult({
        price: r0.prediction_rs_per_kg,
        date: r0.prediction_date,
        grade: r0.grade,
      });
    } catch (e: any) {
      Alert.alert("Network / Server Error", e?.message || "Could not reach server.");
    } finally {
      setLoadingOne(false);
    }
  }

  async function generateNext7Days() {
    const startDate = form.prediction_date?.trim();
    if (!isValidYmd(startDate)) {
      Alert.alert("Invalid date", "Please enter prediction_date as YYYY-MM-DD (e.g., 2027-04-10).");
      return;
    }

    setLoading7(true);
    setSeries7(null);

    try {
      const dates = Array.from({ length: 7 }, (_, i) => addDaysYmd(startDate, i));

      // Call /predict 7 times with different prediction_date
      const responses = await Promise.all(
        dates.map((d) =>
          postPredict({
            grade: payloadBase.grade,
            overrides: { ...payloadBase.overrides, prediction_date: d },
          })
        )
      );

      const prices = responses.map((resp, idx) => {
        const r0 = resp?.results?.[0];
        if (!resp?.success || !r0?.success || typeof r0.prediction_rs_per_kg !== "number") {
          throw new Error(`Failed for date ${dates[idx]}`);
        }
        return r0.prediction_rs_per_kg;
      });

      setSeries7({ dates, prices });
      // Also update the “single” result to the first day
      setOneResult({ price: prices[0], date: dates[0], grade: payloadBase.grade });
    } catch (e: any) {
      Alert.alert("7-day forecast error", e?.message || "Could not generate next 7 days.");
    } finally {
      setLoading7(false);
    }
  }

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Predict Tea Price</Text>
      <Text style={styles.sub}>Uses API: /predict • Generates next 7 days chart</Text>

      <Card>
        <Text style={styles.h}>Select Grade</Text>
        <View style={styles.pillRow}>
          {gradeOptions.map((g) => (
            <Text
              key={g}
              onPress={() => setForm((p) => ({ ...p, grade: g }))}
              style={[styles.pillText, pill(form.grade === g)]}
            >
              {g}
            </Text>
          ))}
        </View>

        <Divider />

        <Text style={styles.h}>Enter Inputs</Text>

        <View style={styles.grid}>
          <Field label="Rainfall (mm)" value={form.rainfall_mm} onChange={(v) => setForm((p) => ({ ...p, rainfall_mm: cleanNum(v) }))} />
          <Field
            label="Temperature (°C)"
            value={form.temperature_c}
            onChange={(v) => setForm((p) => ({ ...p, temperature_c: cleanNum(v) }))}
          />
          <Field
            label="Production (kg)"
            value={form.production_kg}
            onChange={(v) => setForm((p) => ({ ...p, production_kg: cleanInt(v) }))}
          />
          <Field label="Exports (kg)" value={form.exports_kg} onChange={(v) => setForm((p) => ({ ...p, exports_kg: cleanInt(v) }))} />
          <Field label="Fuel index" value={form.fuel_index} onChange={(v) => setForm((p) => ({ ...p, fuel_index: cleanInt(v) }))} />
          <Field
            label="Inflation YoY (%)"
            value={form.inflation_yoy_pct}
            onChange={(v) => setForm((p) => ({ ...p, inflation_yoy_pct: cleanNum(v) }))}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={styles.label}>Prediction date (YYYY-MM-DD)</Text>
          <TextInput
            value={form.prediction_date}
            onChangeText={(v) => setForm((p) => ({ ...p, prediction_date: v }))}
            style={styles.input}
            placeholder="2027-04-10"
            placeholderTextColor={colors.mut}
          />
        </View>

        <AppButton
          title={loadingOne ? "Predicting..." : "Predict Price (Single Day)"}
          onPress={predictOne}
          disabled={loadingOne || loading7}
          style={{ marginTop: 14 }}
        />

        <AppButton
          title={loading7 ? "Generating..." : "Generate Next 7 Days Chart"}
          variant="secondary"
          onPress={generateNext7Days}
          disabled={loadingOne || loading7}
          style={{ marginTop: 10 }}
        />

        {(loadingOne || loading7) && (
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 6, color: colors.mut, fontWeight: "700" }}>Contacting server...</Text>
          </View>
        )}
      </Card>

      {oneResult && (
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.h}>Prediction Result</Text>
          <Text style={styles.big}>{oneResult.price.toFixed(2)} LKR/kg</Text>
          <Text style={styles.mut}>
            Grade: {oneResult.grade} • Date: {oneResult.date}
          </Text>
        </Card>
      )}

      {series7 && (
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.h}>Next 7 Days Forecast</Text>
          <Text style={styles.mut}>
            {form.grade} • {series7.dates[0]} → {series7.dates[6]}
          </Text>

          <View style={{ marginTop: 12, alignItems: "center" }}>
            <SimpleLineChart data={series7.prices} yLabel="LKR/kg" />
          </View>

          <Divider />

          <Text style={styles.h}>Dates</Text>
          <Text style={styles.mut}>{series7.dates.join("  •  ")}</Text>
        </Card>
      )}
    </ScrollView>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={{ flex: 1, minWidth: 150 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChange} style={styles.input} keyboardType="decimal-pad" placeholderTextColor={colors.mut} />
    </View>
  );
}

function cleanInt(v: string) {
  return v.replace(/[^0-9]/g, "");
}
function cleanNum(v: string) {
  const cleaned = v.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 2) return cleaned;
  return `${parts[0]}.${parts.slice(1).join("")}`;
}
function toInt(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}
function toNum(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function isValidYmd(s: string) {
  // basic YYYY-MM-DD validation
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && s === d.toISOString().slice(0, 10);
}

function addDaysYmd(ymd: string, days: number) {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  wrap: { padding: 16, paddingBottom: 28 },
  title: { fontSize: 22, fontWeight: "900", color: colors.text },
  sub: { color: colors.mut, fontWeight: "700", marginTop: 4, marginBottom: 12 },
  h: { fontSize: 16, fontWeight: "900", color: colors.text },
  label: { color: colors.mut, fontWeight: "800", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontWeight: "800",
    color: colors.text,
  },
  pillRow: { flexDirection: "row", gap: 10, flexWrap: "wrap", marginTop: 10 },
  pillText: { fontWeight: "900", color: colors.text },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  big: { fontSize: 34, fontWeight: "900", color: colors.text, marginTop: 10 },
  mut: { color: colors.mut, fontWeight: "700", marginTop: 6 },
});
