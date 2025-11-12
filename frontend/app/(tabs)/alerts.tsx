import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

const MOCK_ALERTS = [
  { id: '1', type: 'Critical', title: 'Irrigation Failure', body: 'Pump 04 in North Sector stopped responding.', time: '10:24 AM', read: false },
  { id: '2', type: 'Warning', title: 'Low Humidity', body: 'Greenhouse B is below 40% humidity threshold.', time: '09:15 AM', read: false },
  { id: '3', type: 'Info', title: 'System Update', body: 'Smart-Sgri firmware v2.1 successfully installed.', time: 'Yesterday', read: true },
  { id: '4', type: 'Success', title: 'Harvest Complete', body: 'Batch #88 tracking data has been uploaded.', time: 'Yesterday', read: true },
];

export default function FeedAlertsScreen() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const markAllRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const renderItem = ({ item }: { item: typeof MOCK_ALERTS[0] }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={[styles.alertItem, !item.read && styles.unreadBackground]}
    >
      <View style={[styles.iconCircle, { backgroundColor: getIconConfig(item.type).bg }]}>
        <Ionicons 
          name={getIconConfig(item.type).name as any} 
          size={22} 
          color={getIconConfig(item.type).color} 
        />
      </View>

      <View style={styles.content}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemTime}>{item.time}</Text>
        </View>
        <Text style={styles.itemBody} numberOfLines={2}>
          {item.body}
        </Text>
      </View>

      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.screenTitle}>Activity</Text>
          <Text style={styles.countText}>
            {alerts.filter(a => !a.read).length} unread notifications
          </Text>
        </View>
        <TouchableOpacity style={styles.readAllBtn} onPress={markAllRead}>
          <Ionicons name="checkmark-done" size={20} color={colors.primary} />
          <Text style={styles.readAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>All clear!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const getIconConfig = (type: string) => {
  switch (type) {
    case 'Critical': return { name: 'flash', color: '#EF4444', bg: '#FEE2E2' };
    case 'Warning': return { name: 'warning', color: '#F59E0B', bg: '#FEF3C7' };
    case 'Success': return { name: 'checkmark-circle', color: '#10B981', bg: '#D1FAE5' };
    default: return { name: 'information-circle', color: '#3B82F6', bg: '#DBEAFE' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
  },
  countText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  readAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  readAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary || "#4F46E5",
  },
  listContent: {
    flexGrow: 1,
  },
  alertItem: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  unreadBackground: {
    backgroundColor: "#F8FAFC",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  itemTime: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  itemBody: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary || "#3B82F6",
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "600",
  },
});