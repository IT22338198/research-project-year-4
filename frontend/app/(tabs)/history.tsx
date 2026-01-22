import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Theme and Mock Data
import { colors } from "@/constants/theme";
import Card from "@/components/Card";
import SeverityBadge from "@/components/SeverityBadge";
import { DISEASE_LIBRARY, INITIAL_HISTORY } from "@/constants/mock";

export default function ProfessionalHistory() {
  const [search, setSearch] = useState("");
  
  const byKey = useMemo(() => new Map(DISEASE_LIBRARY.map((d) => [d.key, d])), []);

  // Filter logic for search
  const filteredHistory = INITIAL_HISTORY.filter(h => {
    const d = byKey.get(h.diseaseKey);
    return d?.name.toLowerCase().includes(search.toLowerCase()) || h.note.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Sticky Search & Header Area */}
      <View style={styles.header}>
        <Text style={styles.title}>Detection History</Text>
        <Text style={styles.subtitle}>{INITIAL_HISTORY.length} total scans performed</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            placeholder="Search diseases or notes..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.listWrap}
        showsVerticalScrollIndicator={false}
      >
        {filteredHistory.length > 0 ? (
          filteredHistory.map((h) => {
            const d = byKey.get(h.diseaseKey);
            return (
              <HistoryItem 
                key={h.id} 
                item={h} 
                disease={d} 
                onPress={() => router.push({ pathname: "/history/[id]", params: { id: h.id }})} 
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#E2E8F0" />
            <Text style={styles.emptyText}>No matching records found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Enhanced List Item Component
 */
function HistoryItem({ item, disease, onPress }: any) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.itemPressable, pressed && styles.pressed]}>
      <Card style={styles.historyCard}>
        <View style={styles.row}>
          {/* Thumbnail Placeholder (Simulating the scanned leaf image) */}
          <View style={styles.thumbnail}>
            <Ionicons name="leaf" size={24} color="#CBD5E1" />
          </View>

          <View style={styles.info}>
            <View style={styles.infoTop}>
              <Text style={styles.diseaseName} numberOfLines={1}>
                {disease?.name ?? "Unknown Detection"}
              </Text>
              <SeverityBadge severity={disease?.severity ?? "Low"} />
            </View>

            <Text style={styles.note} numberOfLines={1}>
              {item.note || "No additional notes added"}
            </Text>

            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
              <Text style={styles.dateText}>{item.date}</Text>
              <View style={styles.dot} />
              <Text style={styles.cropText}>Tomato Crop</Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 20,
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  listWrap: {
    padding: 20,
    paddingBottom: 40,
  },
  itemPressable: {
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  historyCard: {
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  infoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  diseaseName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
    flex: 1,
    marginRight: 8,
  },
  note: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "700",
    marginLeft: 4,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 8,
  },
  cropText: {
    fontSize: 12,
    color: colors.primary || "#4F46E5",
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 12,
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "600",
  },
});