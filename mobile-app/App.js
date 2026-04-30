import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { LanguageProvider, useLanguage } from "./src/context/LanguageContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

// Screens
import { SignInScreen } from "./src/screens/SignInScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { ShipmentListScreen } from "./src/screens/ShipmentListScreen";
import { ShipmentDetailScreen } from "./src/screens/ShipmentDetailScreen";
import { AnalyticsScreen } from "./src/screens/AnalyticsScreen";
import { AlertsScreen } from "./src/screens/AlertsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { EditProfileScreen } from "./src/screens/EditProfileScreen";
import { ChangePasswordScreen } from "./src/screens/ChangePasswordScreen";
import { AIAssistantScreen } from "./src/screens/AIAssistantScreen";

const colors = {
  primary: "#2563eb",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#7c3aed",
  background: "#f8fafc",
  card: "#ffffff",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Shipments") {
            iconName = focused ? "cube" : "cube-outline";
          } else if (route.name === "Analytics") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "Alerts") {
            iconName = focused ? "notifications" : "notifications-outline";
          } else if (route.name === "AI") {
            iconName = focused ? "sparkles" : "sparkles-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Shipments" component={ShipmentListScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen
        name="AI"
        component={AIAssistantScreen}
        options={{ title: "AI Assistant" }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Content
function AppContent() {
  const { isLoggedIn } = useAuth();
  const { t } = useLanguage();

  // ADD THIS: Debug log
  useEffect(() => {
    console.log("📱 AppContent sees isLoggedIn:", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="SignIn" component={SignInScreen} />
          ) : (
            <Stack.Screen name="Main">
              {(props) => (
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;

                      if (route.name === "Dashboard") {
                        iconName = focused ? "home" : "home-outline";
                      } else if (route.name === "Shipments") {
                        iconName = focused ? "cube" : "cube-outline";
                      } else if (route.name === "Analytics") {
                        iconName = focused ? "bar-chart" : "bar-chart-outline";
                      } else if (route.name === "Alerts") {
                        iconName = focused ? "notifications" : "notifications-outline";
                      } else if (route.name === "AI") {
                        iconName = focused ? "sparkles" : "sparkles-outline";
                      } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                      }

                      return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                  })}
                >
                  <Tab.Screen name="Dashboard" component={DashboardScreen} />
                  <Tab.Screen name="Shipments" component={ShipmentListScreen} />
                  <Tab.Screen name="Analytics" component={AnalyticsScreen} />
                  <Tab.Screen name="Alerts" component={AlertsScreen} />
                  <Tab.Screen
                    name="AI"
                    component={AIAssistantScreen}
                    options={{ title: "AI Assistant" }}
                  />
                  <Tab.Screen name="Profile" component={ProfileScreen} />
                </Tab.Navigator>
              )}
            </Stack.Screen>
          )}
          <Stack.Screen name="ShipmentDetail" component={ShipmentDetailScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

// Main App Component with Providers
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}