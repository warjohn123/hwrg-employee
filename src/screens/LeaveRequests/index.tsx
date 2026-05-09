import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./LeaveRequests.styles";

export default function LeaveRequestsScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Select a Request</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Leaves")}
          activeOpacity={0.8}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="event-note" size={22} color="#16a34a" />
          </View>

          <View>
            <Text style={styles.cardTitle}>Leaves</Text>
            <Text style={styles.cardDescription}>
              Submit and track your leave requests.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
