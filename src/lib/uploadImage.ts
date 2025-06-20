import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "./supabase";

export async function uploadImage(uri: string, userId: string) {
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
