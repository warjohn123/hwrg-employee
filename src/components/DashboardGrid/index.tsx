import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./DashboardGrid.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type DashboardItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  section: string;
};

const DATA: DashboardItem[] = [
  { id: "1", label: "Payroll", icon: "receipt", section: "HR & ATTENDANCE" },
  //   { id: "2", label: "CIAO", icon: "access-time", section: "HR & ATTENDANCE" },
  {
    id: "3",
    label: "Attendance",
    icon: "event-available",
    section: "HR & ATTENDANCE",
  },
  {
    id: "4",
    label: "My Requests",
    icon: "check-circle",
    section: "HR & ATTENDANCE",
  },
  //   { id: "5", label: "ReadyInsure", icon: "shield", section: "FINANCES" },
];

export default function DashboardGrid() {
  const groupedData = DATA.reduce((acc: any, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <View>
      {Object.keys(groupedData).map((section) => (
        <View key={section} style={{ marginBottom: 24 }}>
          <Text style={styles.sectionTitle}>{section}</Text>
          <FlatList
            data={groupedData[section]}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card}>
                <MaterialIcons name={item.icon} size={28} color="#2ecc71" />
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ))}
    </View>
  );
}
