import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { styles } from "./Timesheet.styles";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { ITimelog } from "../../types/ITimelog";
import { getTimeLogs } from "../../services/timelogs.service";
import { PAGE_SIZE } from "../../constants/PAGE_SIZE";
import { formatDate } from "../../lib/formatDate";

export default function TimesheetScreen() {
  const user = useCurrentUser();
  const [timelogs, setTimelogs] = useState<ITimelog[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchTimeLogs = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getTimeLogs(user?.id);
      setTimelogs((prev) => [...prev, ...res.timelogs]);
      setHasMore(res.timelogs.length === PAGE_SIZE);
      setPage(page + 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: ITimelog }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={styles.time}>Clock In: {formatDate(item.clock_in)}</Text>
      <Text style={styles.time}>Clock Out: {formatDate(item.clock_out)}</Text>
    </View>
  );

  useEffect(() => {
    if (user) {
      fetchTimeLogs();
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={timelogs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        onEndReached={fetchTimeLogs}
        onEndReachedThreshold={0.5}
        refreshing={loading}
        onRefresh={fetchTimeLogs}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />
    </SafeAreaView>
  );
}
