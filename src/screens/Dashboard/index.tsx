import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import AttendanceButtons from "../../components/Attendance";
import CameraContainer from "../../components/CameraContainer";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { styles } from "./Dashboard.styles";

export default function EmployeeDashboardScreen() {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<"clockIn" | "clockOut" | null>(
    null
  );
  const user = useCurrentUser() as User;
  return (
    <>
      {isCameraOpen ? (
        <CameraContainer
          setIsCameraOpen={setIsCameraOpen}
          currentMode={currentMode}
        />
      ) : (
        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            <Text style={styles.header}>Welcome back, {user?.email} 👋</Text>

            <AttendanceButtons
              setIsCameraOpen={setIsCameraOpen}
              setCurrentMode={setCurrentMode}
              user={user}
            />

            {/* <Text style={styles.sectionTitle}>Recent Activity</Text>
            <FlatList
              data={activities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.activityItem}>
                  <Text style={styles.activityText}>{item.activity}</Text>
                </View>
              )}
            /> */}
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
