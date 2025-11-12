import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { colors } from "@/constants/theme";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>DU</Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>Demo User</Text>
          <Text style={styles.userRole}>Farmer • Member since 2024</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <ProfileOption 
            icon="person-outline" 
            label="Personal Information" 
            onPress={() => {}} 
          />
          <ProfileOption 
            icon="notifications-outline" 
            label="Notifications" 
            badge="3"
            onPress={() => {}} 
          />
          <ProfileOption 
            icon="shield-checkmark-outline" 
            label="Security & Privacy" 
            onPress={() => {}} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <ProfileOption 
            icon="cloud-offline-outline" 
            label="Offline Mode" 
            rightText="Enabled"
            onPress={() => {}} 
          />
          <ProfileOption 
            icon="sync-outline" 
            label="Data Synchronization" 
            onPress={() => {}} 
          />
          <ProfileOption 
            icon="language-outline" 
            label="Language" 
            rightText="English"
            onPress={() => {}} 
          />
        </View>

        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <ProfileOption 
            icon="help-circle-outline" 
            label="Help Support" 
            onPress={() => {}} 
          />
          <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace("/login")}>
            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>Smart-Sgri v1.0.4 (Build 122)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}


function ProfileOption({ icon, label, onPress, rightText, badge }: any) {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.6}>
      <View style={styles.optionLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={20} color="#444" />
        </View>
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
      
      <View style={styles.optionRight}>
        {rightText && <Text style={styles.rightText}>{rightText}</Text>}
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 8,
    borderBottomColor: "#F8F9FA",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary || "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#111",
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },
  userRole: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#AAA",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 16,
    marginLeft: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightText: {
    fontSize: 14,
    color: "#999",
    marginRight: 8,
    fontWeight: "500",
  },
  badge: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF3B30",
    marginLeft: 12,
  },
  versionText: {
    textAlign: "center",
    color: "#BBB",
    fontSize: 12,
    marginVertical: 30,
    fontWeight: "500",
  },
});