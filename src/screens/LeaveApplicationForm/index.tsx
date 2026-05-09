import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { createLeaveApplication } from "../../services/leaves.service";
import { styles } from "./LeaveApplicationForm.styles";

type LeaveType = "Sick" | "Vacation";
type PickerTarget = "start" | "end" | null;

let NativeDatePicker: any = null;
if (Platform.OS !== "web") {
  NativeDatePicker = require("@react-native-community/datetimepicker").default;
}

const formatDisplayDate = (date: Date | null) => {
  if (!date) return "MM/DD/YYYY";

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const formatWebDateValue = (date: Date | null) => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseWebDateValue = (value: string) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

function DatePickerField({
  label,
  value,
  webValue,
  onPress,
  onWebChange,
  useNativePicker,
}: {
  label: string;
  value: string;
  webValue: string;
  onPress: () => void;
  onWebChange: (v: string) => void;
  useNativePicker: boolean;
}) {
  return (
    <View style={styles.dateField}>
      <Text style={styles.dateLabel}>{label}</Text>
      {useNativePicker ? (
        <TouchableOpacity
          style={styles.dateInput}
          activeOpacity={0.85}
          onPress={onPress}
        >
          <MaterialIcons name="calendar-today" size={16} color="#9ca3af" />
          <Text
            style={[
              styles.dateText,
              value === "MM/DD/YYYY" && styles.datePlaceholder,
            ]}
          >
            {value}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.dateInput}>
          <MaterialIcons name="calendar-today" size={16} color="#9ca3af" />
          <input
            type="date"
            value={webValue}
            onChange={(e) => onWebChange(e.currentTarget.value)}
            style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: 14,
              color: "#111827",
              width: "100%",
            }}
          />
        </View>
      )}
    </View>
  );
}

export default function LeaveApplicationFormScreen() {
  const navigation = useNavigation<any>();
  const currentUser = useCurrentUser();
  const [leaveType, setLeaveType] = useState<LeaveType>("Sick");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isNativePicker = Platform.OS !== "web" && Boolean(NativeDatePicker);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Android returns dismissed/set. On iOS, we close after selection for a simple tap flow.
    if (event?.type === "dismissed") {
      setPickerTarget(null);
      return;
    }

    if (!selectedDate || !pickerTarget) return;

    if (pickerTarget === "start") {
      setStartDate(selectedDate);
      if (endDate && selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }

    if (pickerTarget === "end") {
      setEndDate(selectedDate);
    }

    setPickerTarget(null);
  };

  const currentPickerDate =
    pickerTarget === "start"
      ? (startDate ?? new Date())
      : (endDate ?? startDate ?? new Date());

  const handleWebStartDateChange = (value: string) => {
    const selectedDate = parseWebDateValue(value);
    if (!selectedDate) {
      setStartDate(null);
      return;
    }

    setStartDate(selectedDate);
    if (endDate && selectedDate > endDate) {
      setEndDate(selectedDate);
    }
  };

  const handleWebEndDateChange = (value: string) => {
    const selectedDate = parseWebDateValue(value);
    if (!selectedDate) {
      setEndDate(null);
      return;
    }

    setEndDate(selectedDate);
  };

  const toApiDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      Alert.alert("Unable to submit", "User session not found.");
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert("Missing dates", "Please select both start and end dates.");
      return;
    }

    if (!reason.trim()) {
      Alert.alert("Missing reason", "Please state a reason for your request.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createLeaveApplication({
        user_id: currentUser.id,
        leave_type: leaveType,
        start_date: toApiDate(startDate),
        end_date: toApiDate(endDate),
        reason: reason.trim(),
      });

      Alert.alert("Success", "Leave application submitted.");
      navigation.navigate("Leaves");
    } catch (e: any) {
      Alert.alert("Submission failed", e?.message || "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Leave Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Leave Type</Text>
          <View style={styles.typeRow}>
            {(["Sick", "Vacation"] as LeaveType[]).map((type) => {
              const isActive = type === leaveType;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    isActive && styles.typeButtonActive,
                  ]}
                  onPress={() => setLeaveType(type)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[styles.typeText, isActive && styles.typeTextActive]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Select Dates */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Select Dates</Text>
          <View style={styles.dateRow}>
            <DatePickerField
              label="From"
              value={formatDisplayDate(startDate)}
              webValue={formatWebDateValue(startDate)}
              onPress={() => setPickerTarget("start")}
              onWebChange={handleWebStartDateChange}
              useNativePicker={isNativePicker}
            />
            <DatePickerField
              label="To"
              value={formatDisplayDate(endDate)}
              webValue={formatWebDateValue(endDate)}
              onPress={() => setPickerTarget("end")}
              onWebChange={handleWebEndDateChange}
              useNativePicker={isNativePicker}
            />
          </View>

          {isNativePicker && pickerTarget && (
            <NativeDatePicker
              value={currentPickerDate}
              mode="date"
              onChange={handleDateChange}
              minimumDate={
                pickerTarget === "end" ? (startDate ?? undefined) : undefined
              }
            />
          )}
        </View>

        {/* Reason */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Reason</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="State your reason..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={5}
            value={reason}
            onChangeText={setReason}
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
