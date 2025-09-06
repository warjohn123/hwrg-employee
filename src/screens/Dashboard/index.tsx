import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import AttendanceButtons from "../../components/Attendance";
import CameraContainer from "../../components/CameraContainer";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { styles } from "./Dashboard.styles";
import Greetings from "../../components/Greetings";
import { IUser } from "../../types/IUser";
import { fetchUserDetails } from "../../services/user.service";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function EmployeeDashboardScreen() {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<"clockIn" | "clockOut" | null>(
    null
  );
  const [employee, setEmployee] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useCurrentUser() as User;

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const res = await fetchUserDetails(user?.id);
      setEmployee(res ?? null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserDetail();
  }, [user]);

  if (loading) return <LoadingSpinner />;

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
            {employee && <Greetings user={employee} />}

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
