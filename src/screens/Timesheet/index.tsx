import React from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { styles } from "./Timesheet.styles";

const timesheetData = [
  { id: "1", date: "2025-06-15", clockIn: "09:00 AM", clockOut: "06:00 PM" },
  { id: "2", date: "2025-06-14", clockIn: "10:00 AM", clockOut: "07:00 PM" },
  { id: "3", date: "2025-06-13", clockIn: "09:30 AM", clockOut: "06:30 PM" },
];

export default function TimesheetScreen() {
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.time}>Clock In: {item.clockIn}</Text>
      <Text style={styles.time}>Clock Out: {item.clockOut}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={timesheetData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}
