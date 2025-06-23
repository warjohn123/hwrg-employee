import { PAGE_SIZE } from "../constants/PAGE_SIZE";
import { ITimelog } from "../types/ITimelog";

export async function getTimeLogs(user_id, pageNumber = 1) {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/timelogs?user_id=${user_id}&page=${pageNumber}&limit=${PAGE_SIZE}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();

    return data;
  } catch (e) {
    console.error(e);
  }
}

export async function clockIn(clock_in_photo, user_id) {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/timelogs/clock-in`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, clock_in_photo }),
      }
    );

    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function clockOut(clock_out_photo, user_id) {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/timelogs/clock-out`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, clock_out_photo }),
      }
    );

    const data = await res.json();

    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function hasClockedInToday(userId: string) {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/timelogs/current-clockin?user_id=${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = (await res.json()) as ITimelog[];

    return data.length > 0;
  } catch (e) {
    console.error(e);
  }
}
