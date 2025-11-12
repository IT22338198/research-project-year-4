import React, { useMemo, useState } from "react";
import { ScrollView, Text, StyleSheet, TextInput, View, ActivityIndicator, Alert } from "react-native";
import { colors } from "@/constants/theme";
import Card from "@/components/Card";
import Divider from "@/components/Divider";
import AppButton from "@/components/AppButton";
import SimpleLineChart from "@/components/SimpleLineChart";
import { API_BASE } from "@/constants/api";

type Region = "Nuwara_Eliya" | "Uva" | "Kandy" | "Sabaragamuwa" | "Galle";

type YieldSimpleBody = {
  region: Region;
  year: number;
  month: number;
  rainfall_mm: number;
  temp_avg_c: number;
  temp_min_c: number;
  temp_max_c: number;
  humidity_pct: number;
  soil_ph: number;
  soil_ec_ds_m: number;
  fertilizer_kg_per_ha: number;
  disease_index: number;
};

type YieldSimpleResponse = {
  success: boolean;
  meta?: {
    history_months_used: number;
    region: string;
    warnings: string[];
  };
  prediction?: {
    for_month: string; // "2026-03-01"
    yield_kg_per_ha: number;
  };
};

const REGIONS: Region[] = ["Nuwara_Eliya", "Uva", "Kandy", "Sabaragamuwa", "Galle"];

const pill = (active: boolean) => ({
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: active ? colors.primary : colors.border,
  backgroundColor: active ? "#E8FFFE" : "#fff",
});

export default function PredictYieldScreen() {
  const [form, setForm] = useState({
    region: "Nuwara_Eliya" as Region,
    year: "2026",
    month: "3",
    rainfall_mm: "220",
    temp_avg_c: "16.8",
    temp_min_c: "13.2",
    temp_max_c: "21.0",
    humidity_pct: "78",
    soil_ph: "4.9",
    soil_ec_ds_m: "0.25",
    fertilizer_kg_per_ha: "290",
    disease_index: "0.35",
  });

  const [loadingOne, setLoadingOne] = useState(false);
  const [loadingYear, setLoadingYear] = useState(false);

  const [result, setResult] = useState<YieldSimpleResponse | null>(null);
  const [yearSeries, setYearSeries] = useState<number[] | null>(null);

  const payloadOne: YieldSimpleBody | null = useMemo(() => {
    const year = toInt(form.year);
    const month = toInt(form.month);
    if (!year || !month) return null;

    return {
      region: form.region,
      year,
      month,
      rainfall_mm: toNum(form.rainfall_mm),
      temp_avg_c: toNum(form.temp_avg_c),
      temp_min_c: toNum(form.temp_min_c),
      temp_max_c: toNum(form.temp_max_c),
      humidity_pct: toNum(form.humidity_pct),
      soil_ph: toNum(form.soil_ph),
      soil_ec_ds_m: toNum(form.soil_ec_ds_m),
      fertilizer_kg_per_ha: toNum(form.fertilizer_kg_per_ha),
      disease_index: toNum(form.disease_index),
    };
  }, [form]);

  async function postYield(body: YieldSimpleBody): Promise<YieldSimpleResponse> {
    const res = await fetch(`${API_BASE}/predict/yield-simple`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as YieldSimpleResponse;
    if (!res.ok) {
      throw new Error((data as any)?.message || `HTTP ${res.status}`);
    }
    return data;
  }

  async function predictOne() {
    if (!payloadOne) {
      Alert.alert("Invalid input", "Please check year/month and numeric fields.");
      return;
    }
    setLoadingOne(true);
    setResult(null);
    try {
      const data = await postYield(payloadOne);
      if (!data?.success) {
        Alert.alert("Prediction failed", JSON.stringify(data));
        return;
      }
      setResult(data);
    } catch (e: any) {
      Alert.alert("Network / Server Error", e?.message || "Could not reach server.");
    } finally {
      setLoadingOne(false);
    }
  }

  async function generateYearChart() {
    if (!payloadOne) {
      Alert.alert("Invalid input", "Please check year and numeric fields.");
      return;
    }

    setLoadingYear(true);
    setYearSeries(null);

    try {
      const base = { ...payloadOne };
      const promises = Array.from({ length: 12 }, (_, i) => {
        const m = i + 1;
        return postYield({ ...base, month: m });
      });

      const responses = await Promise.all(promises);

      const series = responses.map((r) => {
        const y = r?.prediction?.yield_kg_per_ha;
        return typeof y === "number" ? y : 0;
      });

      setYearSeries(series);
    } catch (e: any) {
      Alert.alert("Chart Error", e?.message || "Could not generate yearly chart.");
    } finally {
      setLoadingYear(false);
    }
  }

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.wrap}>
      <Text style={styles.title}>Predict Tea Yield (Simple)</Text>
      <Text style={styles.sub}>Uses API: /predict/yield-simple</Text>

      <Card>
        <Text style={styles.h}>Region</Text>
        <View style={styles.pillRow}>
          {REGIONS.map((r) => (
            <Text
              key={r}
              onPress={() => setForm((p) => ({ ...p, region: r }))}
              style={[styles.pillText, pill(form.region === r)]}
            >
              {r}
            </Text>
          ))}
        </View>

        <Divider />

        <Text style={styles.h}>Time</Text>
        <View style={styles.row2}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              value={form.year}
              onChangeText={(v) => setForm((p) => ({ ...p, year: cleanInt(v) }))}
              style={styles.input}
              keyboardType="number-pad"
              placeholderTextColor={colors.mut}
              placeholder="2026"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Month (1-12)</Text>
            <TextInput
              value={form.month}
              onChangeText={(v) => setForm((p) => ({ ...p, month: cleanInt(v) }))}
              style={styles.input}
              keyboardType="number-pad"
              placeholderTextColor={colors.mut}
              placeholder="3"
            />
          </View>
        </View>

        <Divider />

        <Text style={styles.h}>Weather</Text>
        <View style={styles.grid}>
          <Field label="Rainfall (mm)" value={form.rainfall_mm} onChange={(v) => setForm((p) => ({ ...p, rainfall_mm: cleanNum(v) }))} />
          <Field label="Humidity (%)" value={form.humidity_pct} onChange={(v) => setForm((p) => ({ ...p, humidity_pct: cleanNum(v) }))} />
          <Field label="Temp Avg (°C)" value={form.temp_avg_c} onChange={(v) => setForm((p) => ({ ...p, temp_avg_c: cleanNum(v) }))} />
          <Field label="Temp Min (°C)" value={form.temp_min_c} onChange={(v) => setForm((p) => ({ ...p, temp_min_c: cleanNum(v) }))} />
          <Field label="Temp Max (°C)" value={form.temp_max_c} onChange={(v) => setForm((p) => ({ ...p, temp_max_c: cleanNum(v) }))} />
        </View>

        <Divider />

        <Text style={styles.h}>Soil & Farm</Text>
        <View style={styles.grid}>
          <Field label="Soil pH" value={form.soil_ph} onChange={(v) => setForm((p) => ({ ...p, soil_ph: cleanNum(v) }))} />
          <Field label="Soil EC (dS/m)" value={form.soil_ec_ds_m} onChange={(v) => setForm((p) => ({ ...p, soil_ec_ds_m: cleanNum(v) }))} />
          <Field
            label="Fertilizer (kg/ha)"
            value={form.fertilizer_kg_per_ha}
            onChange={(v) => setForm((p) => ({ ...p, fertilizer_kg_per_ha: cleanNum(v) }))}
          />
          <Field
            label="Disease index (0-1)"
            value={form.disease_index}
            onChange={(v) => setForm((p) => ({ ...p, disease_index: cleanNum(v) }))}
          />
        </View>

        <AppButton
          title={loadingOne ? "Predicting..." : "Predict Yield"}
          onPress={predictOne}
          disabled={loadingOne || !payloadOne}
          style={{ marginTop: 14 }}
        />

        <AppButton
          title={loadingYear ? "Generating Chart..." : "Generate Full Year Chart"}
          variant="secondary"
          onPress={generateYearChart}
          disabled={loadingYear || !payloadOne}
          style={{ marginTop: 10 }}
        />

        {(loadingOne || loadingYear) && (
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 6, color: colors.mut, fontWeight: "700" }}>Contacting server...</Text>
          </View>
        )}
      </Card>

      {result?.success && result?.prediction && (
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.h}>Prediction Result</Text>
          <Text style={styles.big}>{result.prediction.yield_kg_per_ha.toFixed(2)} kg/ha</Text>
          <Text style={styles.mut}>For month: {result.prediction.for_month}</Text>

          <Divider />

          <Text style={styles.h}>Meta</Text>
          <Text style={styles.mut}>History months used: {result.meta?.history_months_used ?? "-"}</Text>
          <Text style={styles.mut}>Warnings: {(result.meta?.warnings?.length ?? 0) > 0 ? result.meta!.warnings.join(", ") : "None"}</Text>
        </Card>
      )}

      {yearSeries && (
        <Card style={{ marginTop: 12 }}>
          <Text style={styles.h}>Yearly Yield Trend</Text>
          <Text style={styles.mut}>
            Region: {form.region} • Year: {form.year}
          </Text>

          <View style={{ marginTop: 12, alignItems: "center" }}>
            <SimpleLineChart data={yearSeries} />
          </View>

          <Divider />

          <Text style={styles.mut}>
            Months: 1 → 12 (each point is a prediction from /predict/yield-simple)
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={{ flex: 1, minWidth: 150 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        keyboardType="decimal-pad"
        placeholderTextColor={colors.mut}
      />
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
  row2: { flexDirection: "row", gap: 10, marginTop: 12 },
  pillRow: { flexDirection: "row", gap: 10, flexWrap: "wrap", marginTop: 10 },
  pillText: { fontWeight: "900", color: colors.text },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  big: { fontSize: 34, fontWeight: "900", color: colors.text, marginTop: 10 },
  mut: { color: colors.mut, fontWeight: "700", marginTop: 6 },
});
