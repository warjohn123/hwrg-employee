import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import LoginScreen from "./src/screens/Auth/Login/LoginScreen";
import EmployeeDashboardScreen from "./src/screens/Dashboard/EmployeeDashboardScreen";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulated auth flow (replace with real auth later)
  useEffect(() => {
    const timeout = setTimeout(() => {
      // setIsAuthenticated(true); // Uncomment to skip login screen for testing
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated && (
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLoginSuccess={() => setIsAuthenticated(true)}
              />
            )}
          </Stack.Screen>
        )}

        {isAuthenticated && (
          <Stack.Screen name="Dashboard" component={EmployeeDashboardScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
