import React, { useState } from "react";
import { FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import CameraContainer from "../../components/CameraContainer";
import { styles } from "./Dashboard.styles";
import { IActivity } from "../../types/IActivity";

// const summaryCards = [
//   { title: "Hours Worked", value: "42h", color: "#2563eb" },
//   { title: "Tasks Completed", value: "12", color: "#10b981" },
//   { title: "Salary", value: "$3,200", color: "#f59e0b" },
// ];

export default function EmployeeDashboardScreen() {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  //   const [hasClockedIn, setHasClockedIn] = useState(false);
  const [activities, setActivities] = useState<IActivity[]>([]);

  //   const handleClockIn = () => {
  //     if (hasClockedIn) {
  //       Alert.alert("Already Clocked In", "You have already clocked in today.");
  //       return;
  //     }

  //     const now = new Date();
  //     const timeString = now.toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });

  //     const newActivity = {
  //       id: Date.now().toString(),
  //       activity: `Clocked in at ${timeString}`,
  //     };

  //     setActivities((prev) => [newActivity, ...prev]);
  //     setHasClockedIn(true);
  //     Alert.alert("Success", `You clocked in at ${timeString}`);
  //   };
  return (
    <>
      {isCameraOpen ? (
        <CameraContainer setIsCameraOpen={setIsCameraOpen} />
      ) : (
        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            <Text style={styles.header}>Welcome back, John 👋</Text>

            {/* <View style={styles.cardRow}>
          {summaryCards.map((card, index) => (
            <View
              key={index}
              style={[styles.card, { backgroundColor: card.color }]}
            >
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </View>
          ))}
        </View> */}
            {/* <ClockInButton /> */}
            <Pressable
              style={[styles.clockInButton, ,]}
              onPress={() => setIsCameraOpen(true)}
            >
              <Text style={styles.clockInText}>Clock In</Text>
            </Pressable>

            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <FlatList
              data={activities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.activityItem}>
                  <Text style={styles.activityText}>{item.activity}</Text>
                </View>
              )}
            />
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
