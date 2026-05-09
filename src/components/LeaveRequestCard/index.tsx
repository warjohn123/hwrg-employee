import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DateTime } from "luxon";
import { Text, TouchableOpacity, View } from "react-native";
import type { LeaveRequest } from "../../services/leaves.service";
import { styles } from "./LeaveRequestCard.styles";

interface LeaveRequestCardProps {
  leave: LeaveRequest;
  onPress?: () => void;
}

const getLeaveTypeIcon = (
  leaveType: "Sick" | "Vacation",
): keyof typeof MaterialIcons.glyphMap => {
  return leaveType === "Sick" ? "local-hospital" : "beach-access";
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "Approved":
      return "#16a34a";
    case "Rejected":
      return "#dc2626";
    case "Pending":
    default:
      return "#f59e0b";
  }
};

const formatIsoDate = (value: unknown, format: string) => {
  if (!value) return "-";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return DateTime.fromJSDate(value).toFormat(format);
  }

  if (typeof value === "number") {
    const fromMillis = DateTime.fromMillis(value);
    if (fromMillis.isValid) return fromMillis.toFormat(format);
  }

  const raw = String(value);

  const fromIso = DateTime.fromISO(raw, { setZone: true });
  if (fromIso.isValid) return fromIso.toFormat(format);

  const fromSql = DateTime.fromSQL(raw, { setZone: true });
  if (fromSql.isValid) return fromSql.toFormat(format);

  const fromRfc = DateTime.fromRFC2822(raw, { setZone: true });
  if (fromRfc.isValid) return fromRfc.toFormat(format);

  const nativeDate = new Date(raw);
  if (!Number.isNaN(nativeDate.getTime())) {
    return DateTime.fromJSDate(nativeDate).toFormat(format);
  }

  return "-";
};

export default function LeaveRequestCard({
  leave,
  onPress,
}: LeaveRequestCardProps) {
  const leaveTypeIcon = getLeaveTypeIcon(leave.leave_type);
  const statusColor = getStatusColor(leave.status);

  const startDate = formatIsoDate(leave.start_date, "MMM d");
  const endDate = formatIsoDate(leave.end_date, "MMM d");

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.typeSection}>
          <View style={styles.typeIconContainer}>
            <MaterialIcons name={leaveTypeIcon} size={20} color="#16a34a" />
          </View>
          <View>
            <Text style={styles.leaveType}>{leave.leave_type}</Text>
            <Text style={styles.dateRange}>
              {startDate} - {endDate}
            </Text>
          </View>
        </View>

        <View style={[styles.statusBadge, { borderLeftColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {leave.status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.reason} numberOfLines={2}>
        {leave.reason}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.submittedDate}>
          Submitted {formatIsoDate(leave.created_at, "M/d/yyyy")}
        </Text>
        <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
}
