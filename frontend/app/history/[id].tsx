import React, { useMemo } from "react";
import { ScrollView, Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Theme and Components
import { colors } from "@/constants/theme";
import SeverityBadge from "@/components/SeverityBadge";
import AppButton from "@/components/AppButton";
import { DISEASE_LIBRARY, INITIAL_HISTORY } from "@/constants/mock";

export default function HistoryDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id;

  const record = useMemo(() => INITIAL_HISTORY.find((h) => h.id === id), [id]);
  const disease = useMemo(() => 
    DISEASE_LIBRARY.find((d) => d.key === record?.diseaseKey), [record]
  );

  if (!record) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.mut} />
          <Text style={styles.errorTitle}>Record not found</Text>
          <AppButton title="Go Back" variant="secondary" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Scan Analysis</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Ionicons name="share-outline" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Hero Section (Visual Scan) */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="leaf-outline" size={60} color="#CBD5E1" />
            <Text style={styles.imageText}>AI Scan Analysis Reference</Text>
          </View>
          <View style={styles.floatingBadge}>
            <SeverityBadge severity={disease?.severity ?? "Low"} />
          </View>
        </View>

        {/* 2. Diagnosis Section */}
        <View style={styles.infoSection}>
          <Text style={styles.label}>PRIMARY DIAGNOSIS</Text>
          <Text style={styles.diseaseName}>{disease?.name ?? "Unknown Pathogen"}</Text>
          <Text style={styles.scientificName}>Pathogen: {record.diseaseKey}</Text>
        </View>

        {/* 3. Detailed Metadata Cards */}
        <View style={styles.detailsGrid}>
          <DetailBox icon="calendar" label="Scan Date" value={record.date} />
          <DetailBox icon="barcode" label="Record ID" value={`#${record.id}`} />
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.label}>FARMER NOTES</Text>
          <Text style={styles.noteText}>{record.note || "No notes provided for this scan."}</Text>
        </View>

        {/* 4. Action Center */}
        <View style={styles.actions}>
          <Text style={styles.label}>RECOMMENDED ACTIONS</Text>
          <AppButton
            title="View Treatment Plan"
            onPress={() => router.push({ pathname: "/treatment", params: { diseaseKey: record.diseaseKey } })}
            style={styles.mainAction}
          />
          <AppButton
            title="Explainability AI"
            variant="secondary"
            onPress={() => router.push({ pathname: "/explainability", params: { diseaseKey: record.diseaseKey } })}
            style={styles.subAction}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

/** Helper component for detail boxes */
function DetailBox({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.detailBox}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  errorTitle: { fontSize: 18, fontWeight: "800", color: "#64748B", marginVertical: 16 },
  navbar: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 16, 
    height: 60 
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  shareBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-end" },
  navTitle: { fontSize: 17, fontWeight: "800", color: "#111" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  // Image Section
  imageContainer: { marginTop: 10, position: "relative" },
  imagePlaceholder: {
    height: 220,
    backgroundColor: "#F1F5F9",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  imageText: { marginTop: 10, color: "#94A3B8", fontWeight: "700", fontSize: 12 },
  floatingBadge: { position: "absolute", bottom: 12, right: 12 },

  // Info Section
  infoSection: { marginTop: 24 },
  label: { fontSize: 11, fontWeight: "800", color: "#94A3B8", letterSpacing: 1, marginBottom: 8 },
  diseaseName: { fontSize: 28, fontWeight: "900", color: "#0F172A" },
  scientificName: { fontSize: 14, color: "#64748B", fontStyle: "italic", marginTop: 2 },

  // Grid
  detailsGrid: { flexDirection: "row", gap: 12, marginTop: 24 },
  detailBox: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#F8FAFC", 
    padding: 16, 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9"
  },
  detailLabel: { fontSize: 11, fontWeight: "700", color: "#94A3B8" },
  detailValue: { fontSize: 14, fontWeight: "800", color: "#1E293B" },

  noteBox: { 
    marginTop: 20, 
    backgroundColor: "#FDFCFB", 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: "#F3F0EC" 
  },
  noteText: { fontSize: 15, color: "#475569", lineHeight: 22, fontWeight: "500" },

  // Actions
  actions: { marginTop: 32 },
  mainAction: { height: 56, borderRadius: 16, marginBottom: 12 },
  subAction: { height: 56, borderRadius: 16, borderStyle: "dashed" },
});