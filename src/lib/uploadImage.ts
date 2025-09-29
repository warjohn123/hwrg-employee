import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "./supabase";
import { Platform } from "react-native";

export async function uploadImage(uri: string, userId: string) {
  if (Platform.OS === "web") {
    return await uploadImageWeb(uri, userId);
  }

  try {
    // Read the file into base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Get file extension and MIME type
    const fileExt = uri.split(".").pop();
    const mimeType = "image/jpeg";

    // Upload as ArrayBuffer
    const { data, error } = await supabase.storage
      .from("timelog-photos")
      .upload(`timelogs/${userId}_${Date.now()}.${fileExt}`, decode(base64), {
        contentType: mimeType,
        upsert: true,
      });

    if (error) throw error;

    return data.path; // path to saved image
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

async function uploadImageWeb(uri: string, userId: string) {
  console.log("uri", uri);
  const response = await fetch(uri);
  console.log("response", response);
  const blob = await response.blob();

  const fileName = `timelogs/${userId}_${Date.now()}.jpg`;

  console.log("filename", fileName);

  const { data, error } = await supabase.storage
    .from("timelog-photos")
    .upload(fileName, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }

  console.log("Uploaded file path:", data.path);
  return data.path;
}
