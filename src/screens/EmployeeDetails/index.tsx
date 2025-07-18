import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { styles } from "./EmployeeDetails.styles";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { fetchUserDetails } from "../../services/user.service";
import { IUser } from "../../types/IUser";
import LoadingSpinner from "../../components/LoadingSpinner";
import { supabase } from "../../lib/supabase";

const employee = {
  name: "John Doe",
  position: "Software Engineer",
  department: "IT Department",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  avatar: "https://i.pravatar.cc/150?img=3",
};

export default function EmployeeDetailsScreen() {
  const user = useCurrentUser();
  const [employee, setEmployee] = useState<IUser>();
  const [loading, setLoading] = useState<boolean>(true);

  const employeePicture = supabase.storage
    .from("employees")
    .getPublicUrl(employee?.picture || "").data.publicUrl;

  const fetchUserDetail = async () => {
    setLoading(true);
    try {
      const res = await fetchUserDetails(user?.id);
      setEmployee(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserDetail();
  }, [user]);

  if (loading) return <LoadingSpinner />;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: employeePicture }} style={styles.avatar} />
        <Text style={styles.name}>{employee?.name}</Text>
        <Text style={styles.position}>{employee?.assignment}</Text>

        <View style={styles.infoCard}>
          {/* <Text style={styles.label}>Department:</Text>
          <Text style={styles.value}>{employee.department}</Text> */}

          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{employee?.email}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{employee?.contact}</Text>

          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{employee?.address}</Text>

          <Text style={styles.label}>Birthday:</Text>
          <Text style={styles.value}>{employee?.bday}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
