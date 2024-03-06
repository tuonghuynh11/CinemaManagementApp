import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/User/HomeScreen";
import GlobalColors from "../Color/colors";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import SearchScreen from "../Screens/User/SearchScreen";
import TicketHistoryScreen from "../Screens/User/TicketHistoryScreen";
import { Entypo } from "@expo/vector-icons";
import ProfileScreen from "../Screens/User/ProfileScreen";
import FlatButton from "../Components/UI/FlatButton";
import { Text } from "react-native";
import CinemaListScreen from "../Screens/User/CininemaListScreen";
const BottomTab = createBottomTabNavigator();
function HomeNavigation() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 80,
          backgroundColor: GlobalColors.lightBackground,
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          borderRadius: 15,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: GlobalColors.button,
        tabBarInactiveTintColor: GlobalColors.second_background,
      }}
    >
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-home-outline" size={24} color={color} />
          ),
          headerShown: false,
          title: "Home",
          headerTitle: "Master Cinemas",
          headerTitleStyle: {
            fontSize: 23,
            color: "white",
          },
          headerTitleAlign: "center",
        }}
      />
      <BottomTab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={color} />
          ),
          title: "Search",
          headerStyle: {
            backgroundColor: GlobalColors.mainColor3,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "white",
          },
          headerShown: true,
        }}
      />
      <BottomTab.Screen
        name="TicketHistoryScreen"
        component={TicketHistoryScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="ticket" size={24} color={color} />
          ),
          title: "My Bookings",
          headerStyle: {
            backgroundColor: GlobalColors.mainColor3,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "white",
          },
          headerShown: true,
        }}
      />
      <BottomTab.Screen
        name="CinemaListScreen"
        component={CinemaListScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="theaters" size={24} color={color} />
          ),
          title: "Cinemas",
          headerStyle: {
            backgroundColor: GlobalColors.mainColor3,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            color: "white",
          },
          headerShown: true,
        }}
      />
      <BottomTab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={24} color={color} />
          ),

          headerShown: false,
          title: "Profile",
        }}
      />
    </BottomTab.Navigator>
  );
}
export default HomeNavigation;
