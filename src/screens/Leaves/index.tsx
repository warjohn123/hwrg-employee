import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./Leaves.styles";

type LeaveTab = "Pending" | "Approved" | "Rejected";

const TABS: LeaveTab[] = ["Pending", "Approved", "Rejected"];

const TAB_DETAILS: Record<LeaveTab, string> = {
  Pending: "No pending leave requests yet.",
  Approved: "No approved leave requests yet.",
  Rejected: "No rejected leave requests yet.",
};

export default function LeavesScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<LeaveTab>("Pending");

  const tabMessage = useMemo(() => TAB_DETAILS[activeTab], [activeTab]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Leaves</Text>

        <View style={styles.tabsRow}>
          {TABS.map((tab) => {
            const isActive = tab === activeTab;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.85}
              >
                <Text
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{activeTab}</Text>
          <Text style={styles.panelDescription}>{tabMessage}</Text>
        </View>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Leave Application")}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
