import { useFocusEffect } from "@react-navigation/native";
import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, Text } from "react-native";
import { hasClockedInToday } from "../../services/timelogs.service";
import LoadingSpinner from "../LoadingSpinner";
import { styles } from "./Attendance.styles";

type Props = {
  user: User;
  setIsCameraOpen: (val: boolean) => void;
  setCurrentMode: (val: "clockIn" | "clockOut") => void;
};

export default function AttendanceButtons({
  user,
  setIsCameraOpen,
  setCurrentMode,
}: Props) {
  const [isCheckingAttendance, setIsCheckingAttendance] =
    useState<boolean>(true);
  const [hasClockedIn, setHasClockedIn] = useState<boolean>(false);

  const checkClockIn = async () => {
    setIsCheckingAttendance(true);
    try {
      const alreadyClockedIn = await hasClockedInToday(user!.id);
      setHasClockedIn(alreadyClockedIn!);
    } catch (e) {}

    setIsCheckingAttendance(false);
  };

  useEffect(() => {
    if (user) {
      checkClockIn();
    }
  }, [user]);

  if (isCheckingAttendance) return <LoadingSpinner />;

  return (
    <>
      {hasClockedIn && (
        <Pressable
          style={styles.clockOutButton}
          onPress={() => {
            setCurrentMode("clockOut");
            setIsCameraOpen(true);
            // Alert.alert(
            //   "Are you sure?",
            //   "This action cannot be undone.",
            //   [
            //     { text: "Cancel", style: "cancel" },
            //     {
            //       text: "Yes",
            //       onPress: () => {
            //         setCurrentMode("clockOut");
            //         setIsCameraOpen(true);
            //       },
            //     },
            //   ],
            //   { cancelable: true }
            // );
          }}
        >
          <Text style={styles.clockInText}>Clock Out</Text>
        </Pressable>
      )}

      {!hasClockedIn && (
        <Pressable
          style={styles.clockInButton}
          onPress={() => {
            setCurrentMode("clockIn");
            setIsCameraOpen(true);
          }}
        >
          <Text style={styles.clockInText}>Clock In</Text>
        </Pressable>
      )}
    </>
  );
}
