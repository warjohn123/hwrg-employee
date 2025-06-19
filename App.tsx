import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import LoginScreen from "./src/screens/Auth/Login/LoginScreen";
import EmployeeDashboardScreen from "./src/screens/Dashboard";
import EmployeeDetailsScreen from "./src/screens/EmployeeDetails";
import TimesheetScreen from "./src/screens/Timesheet";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      {!isAuthenticated && (
        <Stack.Navigator>
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
                onPress={() => setIsAuthenticated(false)}
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
