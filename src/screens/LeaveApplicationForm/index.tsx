import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./LeaveApplicationForm.styles";

type LeaveType = "Sick" | "Vacation";

function DatePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.dateField}>
      <Text style={styles.dateLabel}>{label}</Text>
      <View style={styles.dateInput}>
        <MaterialIcons name="calendar-today" size={16} color="#9ca3af" />
        <TextInput
          style={[styles.dateText, !value && styles.datePlaceholder]}
          placeholder="MM/DD/YYYY"
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChange}
          keyboardType={
            Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"
          }
          maxLength={10}
        />
      </View>
    </View>
  );
}

export default function LeaveApplicationFormScreen() {
  const navigation = useNavigation();
  const [leaveType, setLeaveType] = useState<LeaveType>("Sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

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
              value={startDate}
              onChange={setStartDate}
            />
            <DatePickerField label="To" value={endDate} onChange={setEndDate} />
          </View>
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.submitText}>Submit Application</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
