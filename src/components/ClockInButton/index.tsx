import { Pressable, Text } from "react-native";
import { styles } from "./ClockInButton.styles";
import { useState } from "react";
import CameraContainer from "../CameraContainer";

export default function ClockInButton() {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  return (
    <>
      {isCameraOpen ? (
        <CameraContainer setIsCameraOpen={setIsCameraOpen} />
      ) : (
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
