import { IUser } from "../types/IUser";

export async function fetchUserDetails(user_id) {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/users/${user_id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = (await res.json()) as IUser;

    return data;
  } catch (e) {
    console.error(e);
  }
}
