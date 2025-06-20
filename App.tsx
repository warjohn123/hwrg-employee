import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LoginScreen from "./src/screens/Auth/Login/LoginScreen";
import EmployeeDashboardScreen from "./src/screens/Dashboard";
import EmployeeDetailsScreen from "./src/screens/EmployeeDetails";
import TimesheetScreen from "./src/screens/Timesheet";
import { useAuthSession } from "./src/hooks/useAuthSession";
import { supabase } from "./src/lib/supabase";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { session, loading } = useAuthSession();

  console.log("session", session);

  useEffect(() => {
    if (session) setIsAuthenticated(true);
    else setIsAuthenticated(false);
  }, [session]);

  if (loading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <NavigationContainer>
      {!isAuthenticated && (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLoginSuccess={() => setIsAuthenticated(true)}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}

      {isAuthenticated && (
        <Drawer.Navigator
          initialRouteName="Dashboard"
          screenOptions={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.toggleDrawer()}
                style={{ padding: 10 }}
              >
                {/* <Icon name="menu" size={24} /> */}
                <Feather name="menu" size={32} color="black" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => await supabase.auth.signOut()}
                style={{ padding: 10 }}
              >
                <MaterialIcons name="logout" size={24} color="black" />
              </TouchableOpacity>
            ),
            headerTitleAlign: "center",
          })}
        >
          <Drawer.Screen name="Dashboard" component={EmployeeDashboardScreen} />
          <Drawer.Screen name="Timesheet" component={TimesheetScreen} />
          <Drawer.Screen
            name="Employee Details"
            component={EmployeeDetailsScreen}
          />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
}
