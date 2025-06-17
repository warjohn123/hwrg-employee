import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Alert,
  Pressable,
} from "react-native";
import { styles } from "./Dashboard.styles";

const summaryCards = [
  { title: "Hours Worked", value: "42h", color: "#2563eb" },
  { title: "Tasks Completed", value: "12", color: "#10b981" },
  { title: "Salary", value: "$3,200", color: "#f59e0b" },
];

const initialActivities = [
  { id: "1", activity: "Clocked out at 5:03 PM" },
  { id: "2", activity: "Completed Task: Inventory Audit" },
];

export default function EmployeeDashboardScreen() {
  const [hasClockedIn, setHasClockedIn] = useState(false);
  const [activities, setActivities] = useState(initialActivities);

  const handleClockIn = () => {
    if (hasClockedIn) {
      Alert.alert("Already Clocked In", "You have already clocked in today.");
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newActivity = {
      id: Date.now().toString(),
      activity: `Clocked in at ${timeString}`,
    };

    setActivities((prev) => [newActivity, ...prev]);
    setHasClockedIn(true);
    Alert.alert("Success", `You clocked in at ${timeString}`);
  };
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome back, John 👋</Text>

        <View style={styles.cardRow}>
          {summaryCards.map((card, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: card.color }]}
            >
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={[
            styles.clockInButton,
            hasClockedIn && { backgroundColor: "#9ca3af" },
          ]}
          onPress={handleClockIn}
        >
          <Text style={styles.clockInText}>
            {hasClockedIn ? "Already Clocked In" : "Clock In for Today"}
          </Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>{item.activity}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
