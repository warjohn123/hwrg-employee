import { Text, View } from "react-native";
import { styles } from "./Greetings.styles";
import { IUser } from "../../types/IUser";
import Avatar from "../Avatar";
import { supabase } from "../../lib/supabase";

interface Props {
  user: IUser;
}

export default function Greetings({ user }: Props) {
  // const employeePicture = supabase.storage
  //   .from("employees")
  //   .getPublicUrl(user?.picture || "").data.publicUrl;

  // console.log("employeePicture", employeePicture);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Avatar name={user.name} size={50} />
        <Text style={styles.header}>Hey, {user?.name} 👋</Text>
      </View>
    </View>
  );
}
