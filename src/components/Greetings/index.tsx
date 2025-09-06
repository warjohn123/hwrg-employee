import { Text, View } from "react-native";
import { styles } from "./Greetings.styles";
import { IUser } from "../../types/IUser";

interface Props {
  user: IUser;
}

export default function Greetings({ user }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hey, {user?.name} 👋</Text>
    </View>
  );
}
