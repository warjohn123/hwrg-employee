import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LeaveRequestCard from "../../components/LeaveRequestCard";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  fetchLeaveRequests,
  type LeaveRequest,
} from "../../services/leaves.service";
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
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<LeaveTab>("Pending");
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const tabMessage = useMemo(() => TAB_DETAILS[activeTab], [activeTab]);

  useEffect(() => {
    const loadLeaves = async () => {
      if (!currentUser?.id) return;

      setLoading(true);
      try {
        const data = await fetchLeaveRequests(currentUser.id, activeTab);
        console.log("data", data);
        setLeaves(data.leave_requests);
      } catch (e) {
        console.error(e);
        setLeaves([]);
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, [activeTab, currentUser?.id]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
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

        {leaves.length > 0 ? (
          <FlatList
            data={leaves}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <LeaveRequestCard leave={item} />}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        ) : (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>{activeTab}</Text>
            <Text style={styles.panelDescription}>
              {loading ? "Loading..." : tabMessage}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Leave Application")}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
