import { Text, View } from "react-native";
import { styles } from "./Greetings.styles";

export default function Greetings({ user }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hey, {user?.email} 👋</Text>
    </View>
  );
}
