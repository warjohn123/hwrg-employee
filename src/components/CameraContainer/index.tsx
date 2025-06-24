import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, View } from "react-native";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { uploadImage } from "../../lib/uploadImage";
import { clockIn, clockOut } from "../../services/timelogs.service";
import LoadingSpinner from "../LoadingSpinner";
import { styles } from "./CameraContainer.styles";

type Props = {
  setIsCameraOpen: (val: boolean) => void;
  currentMode: "clockIn" | "clockOut" | null;
};

export default function CameraContainer({
  setIsCameraOpen,
  currentMode,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  //   const [facing, setFacing] = useState<CameraType>("front");
  const user = useCurrentUser();

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    setUri(photo!.uri);
  };

  //   const toggleFacing = () => {
  //     setFacing((prev) => (prev === "back" ? "front" : "back"));
  //   };

  const submitPhoto = async () => {
    if (!uri) return;

    setIsSubmitting(true);

    try {
      const imgPath = await uploadImage(uri, user!.id);

      if (currentMode === "clockIn") {
        await clockIn(imgPath, user!.id);
        Alert.alert("Successfully clocked in");
      } else {
        await clockOut(imgPath, user!.id);
        Alert.alert("Successfully clocked out");
      }
    } catch (e: any) {
      Alert.alert("Something went wrong.", e);
      setIsSubmitting(false);
    }
    setIsCameraOpen(false);
  };

  const renderPicture = () => {
    if (isSubmitting) return <LoadingSpinner />;

    return (
      <View>
        <Image
          source={{ uri: uri as any }}
          contentFit="contain"
          style={{ width: 500, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />

        {uri && (
          <>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setIsCameraOpen(false)}
            >
              <Text style={styles.submitText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.submitButton} onPress={submitPhoto}>
              <Text style={styles.submitText}>Submit</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={StyleSheet.absoluteFill} // fills the screen
        ref={ref}
        mode="picture"
        facing={"back"}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.shutterContainer}>
          <View></View>
          <Pressable onPress={takePicture}>
            {({ pressed }) => (
              <View
                style={[
                  styles.shutterBtn,
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.shutterBtnInner,
                    {
                      backgroundColor: "white",
                    },
                  ]}
                />
              </View>
            )}
          </Pressable>
          {/* <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable> */}
        </View>
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}
