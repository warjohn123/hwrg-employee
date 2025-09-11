import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    display: "flex",
    justifyContent: "space-between",
    height: "100%",
    flexDirection: "column",
  },
  dashboardGridContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 30,
    flexWrap: "wrap",
  },
  card: {
    flexBasis: "30%",
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 14,
    color: "#ffffffb3",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#374151",
  },
  activityItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  activityText: {
    color: "#1f2937",
  },
  clockInButton: {
    backgroundColor: "#22c55e",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  clockInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
