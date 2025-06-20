import { useCurrentUser } from "../hooks/useCurrentUser";

export async function createTimelog(photo_url, user_id) {
  console.log("im here");

  console.log("data", { user_id, photo_url });
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/timelogs/add`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, photo_url }),
      }
    );

    return res;
  } catch (e) {
    console.error(e);
  }
}
