import { User } from "@supabase/supabase-js";
import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import AttendanceButtons from "../../components/Attendance";
import CameraContainer from "../../components/CameraContainer";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { styles } from "./Dashboard.styles";
import Greetings from "../../components/Greetings";

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
            <Greetings user={user} />

            <AttendanceButtons
              setIsCameraOpen={setIsCameraOpen}
              setCurrentMode={setCurrentMode}
              user={user}
            />
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
