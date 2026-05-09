export type LeaveRequest = {
  id: string;
  user_id: string;
  leave_type: "Sick" | "Vacation";
  start_date: string;
  end_date: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  created_at: string;
};

const getFirstValue = (obj: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null) return value;
  }

  return null;
};

const getFirstString = (obj: Record<string, any>, keys: string[]) => {
  for (const key of keys) {
    const value = obj?.[key];
    if (typeof value === "string" && value.trim().length > 0)
      return value.trim();

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString();
    }
  }

  return "";
};

const normalizeDateString = (value: unknown) => {
  if (!value) return "";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const fromMillis = new Date(value);
    if (!Number.isNaN(fromMillis.getTime())) return fromMillis.toISOString();
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

    // Keep original string so UI parser can attempt additional formats.
    return trimmed;
  }

  return "";
};

const normalizeLeaveRequest = (raw: Record<string, any>): LeaveRequest => {
  const statusRaw = getFirstString(raw, ["status", "leave_status"]);
  const startRaw = getFirstValue(raw, ["date_from"]);
  const endRaw = getFirstValue(raw, ["date_to"]);
  const createdRaw = getFirstValue(raw, [
    "created_at",
    "createdAt",
    "submitted_at",
    "submittedAt",
  ]);

  return {
    id: String(raw?.id ?? ""),
    user_id: getFirstString(raw, ["user_id", "userId"]),
    leave_type:
      getFirstString(raw, ["leave_type", "leaveType"]) === "Vacation"
        ? "Vacation"
        : "Sick",
    start_date: normalizeDateString(startRaw),
    end_date: normalizeDateString(endRaw),
    reason: getFirstString(raw, ["reason", "remarks", "description"]),
    status:
      statusRaw === "Approved" ||
      statusRaw === "Rejected" ||
      statusRaw === "Pending"
        ? statusRaw
        : "Pending",
    created_at: normalizeDateString(createdRaw),
  };
};

type CreateLeaveApplicationPayload = {
  user_id: string;
  leave_type: "Sick" | "Vacation";
  start_date: string;
  end_date: string;
  reason: string;
};

export async function fetchLeaveRequests(
  user_id: string,
  status: "Pending" | "Approved" | "Rejected",
) {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/leave-requests?user_id=${user_id}&status=${status}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch leave requests.");
    }

    const data = await res.json();

    return {
      leave_requests: data.leave_requests.map((item) =>
        normalizeLeaveRequest(item),
      ),
    };
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function createLeaveApplication(
  payload: CreateLeaveApplicationPayload,
) {
  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/leave-requests`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok) {
      throw new Error(data?.message || "Failed to submit leave application.");
    }

    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
