import React from "react";
import { 
  ScrollView, 
  Text, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  ImageBackground 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { colors } from "@/constants/theme";
import Card from "@/components/Card";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.wrap}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.title}>SmartTea Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <Ionicons name="person" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatBox label="Health Index" value="94%" icon="leaf" color="#10B981" />
          <StatBox label="Last Scan" value="2h ago" icon="time" color="#3B82F6" />
        </View>

        <TouchableOpacity 
          activeOpacity={0.9}
          style={styles.scanHero}
          onPress={() => router.push("/explore")}
        >
          <View style={styles.scanContent}>
            <View style={styles.scanIconBg}>
              <Ionicons name="camera" size={32} color="#fff" />
            </View>
            <View>
              <Text style={styles.scanTitle}>Scan Tea Leaf</Text>
              <Text style={styles.scanSub}>Identify diseases instantly</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>PREDICTIONS & HISTORY</Text>
        <View style={styles.grid}>
          <GridItem 
            title="Yield" 
            icon="analytics" 
            color="#6366F1" 
            onPress={() => router.push("/predict-yield")} 
          />
          <GridItem 
            title="Price" 
            icon="cash" 
            color="#8B5CF6" 
            onPress={() => router.push("/predict-price")} 
          />
          <GridItem 
            title="History" 
            icon="calendar" 
            color="#EC4899" 
            onPress={() => router.push("/history")} 
          />
          <GridItem 
            title="Support" 
            icon="chatbubbles" 
            color="#F59E0B" 
            onPress={() => {}} 
          />
        </View>

        <Card style={styles.explainCard}>
          <View style={styles.explainHeader}>
            <View style={styles.explainIcon}>
              <Ionicons name="bulb" size={20} color="#6366F1" />
            </View>
            <Text style={styles.h}>AI Explainability</Text>
          </View>
          <Text style={styles.mut}>
            Understand how our AI detects Gray Blight and other pathogens using visual heatmaps.
          </Text>
          <TouchableOpacity 
            style={styles.explainBtn}
            onPress={() => router.push({ pathname: "/explainability", params: { diseaseKey: "gray_blight" } })}
          >
            <Text style={styles.explainBtnText}>View Demo</Text>
            <Ionicons name="arrow-forward" size={16} color="#6366F1" />
          </TouchableOpacity>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, icon, color }: any) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function GridItem({ title, icon, color, onPress }: any) {
  return (
    <TouchableOpacity style={styles.gridItem} onPress={onPress}>
      <View style={[styles.gridIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.gridTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  wrap: { padding: 20, paddingBottom: 40 },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 25 
  },
  greeting: { fontSize: 14, color: "#64748B", fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "900", color: "#1E293B" },
  profileCircle: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: "#F1F5F9", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  statsRow: { flexDirection: "row", gap: 15, marginBottom: 25 },
  statBox: { 
    flex: 1, 
    backgroundColor: "#F8FAFC", 
    padding: 16, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9"
  },
  statValue: { fontSize: 18, fontWeight: "800", color: "#1E293B", marginTop: 8 },
  statLabel: { fontSize: 12, color: "#94A3B8", fontWeight: "600" },
  
  scanHero: {
    backgroundColor: "#10B981",
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5
  },
  scanContent: { flexDirection: "row", alignItems: "center", gap: 15 },
  scanIconBg: { 
    width: 56, 
    height: 56, 
    borderRadius: 18, 
    backgroundColor: "rgba(255,255,255,0.2)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  scanTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  scanSub: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: "600" },

  sectionLabel: { fontSize: 12, fontWeight: "800", color: "#94A3B8", letterSpacing: 1, marginBottom: 15 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 15, marginBottom: 30 },
  gridItem: { 
    width: "47%", 
    backgroundColor: "#F8FAFC", 
    padding: 20, 
    borderRadius: 20, 
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9"
  },
  gridIcon: { width: 50, height: 50, borderRadius: 15, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  gridTitle: { fontSize: 14, fontWeight: "700", color: "#334155" },

  explainCard: { padding: 20, borderRadius: 24, backgroundColor: "#FDFDFF", borderColor: "#EEF2FF", borderWidth: 1 },
  explainHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  explainIcon: { width: 32, height: 32, backgroundColor: "#EEF2FF", borderRadius: 10, justifyContent: "center", alignItems: "center" },
  h: { fontSize: 16, fontWeight: "800", color: "#1E293B" },
  mut: { color: "#64748B", fontSize: 14, lineHeight: 20, fontWeight: "500" },
  explainBtn: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 15 },
  explainBtnText: { color: "#6366F1", fontWeight: "700", fontSize: 14 }
});