import { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";
import { clockOut, hasClockedInToday } from "../../services/timelogs.service";
import { Alert, Pressable, Text } from "react-native";
import { styles } from "./Attendance.styles";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
  user: User;
  setIsCameraOpen: (val: boolean) => void;
};

export default function AttendanceButtons({ user, setIsCameraOpen }: Props) {
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

  useFocusEffect(
    useCallback(() => {
      checkClockIn();
    }, [])
  );

  const out = async () => {
    try {
      await clockOut(user?.id);
    } catch (e) {}
  };

  if (isCheckingAttendance) return <LoadingSpinner />;

  return (
    <>
      {hasClockedIn && (
        <Pressable
          style={styles.clockOutButton}
          onPress={() => {
            Alert.alert(
              "Are you sure?",
              "This action cannot be undone.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes, clock out", onPress: () => out() },
              ],
              { cancelable: true }
            );
          }}
        >
          <Text style={styles.clockInText}>Clock Out</Text>
        </Pressable>
      )}

      {!hasClockedIn && (
        <Pressable
          style={styles.clockInButton}
          onPress={() => setIsCameraOpen(true)}
        >
          <Text style={styles.clockInText}>Clock In</Text>
        </Pressable>
      )}
    </>
  );
}
