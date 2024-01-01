import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ManageCinema from "./ManageCinema";
import ManageFoodDrink from "./ManageFoodDrink";
import ManageCinemaMenu from "./ManageCinemaMenu";
import ManageStaff from "./ManageStaff";
import ManageManager from "./ManageManager";
import ManageMovie from "./ManageMovie";
import ManageStatistic from "./ManageStatistic";
import CustomDrawer from "./CustomDrawer";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CinemaStack from "./Stack/CinemaStack";
import FoodDrinkStack from "./Stack/FoodDrinkStack";
import PersonnelStack from "./Stack/PersonnelStack";
import MovieStack from "./Stack/MovieStack";
import StatisticStack from "./Stack/StatisticStack";

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="ManageCoach"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "70%",
        },
        drawerActiveTintColor: "#72C6A1",
        drawerInactiveTintColor: "#FFCE31",
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Manage Cinema"
        component={CinemaStack}
        options={{
          drawerIcon: ({ focused, size }) => (
            <FontAwesome5
              name="theater-masks"
              size={24}
              color={focused ? "#72C6A1" : "#FFCE31"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Manage Food & Drink"
        component={FoodDrinkStack}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="fast-food"
              size={24}
              color={focused ? "#72C6A1" : "#FFCE31"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Manage Personnel"
        component={PersonnelStack}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="person"
              size={24}
              color={focused ? "#72C6A1" : "#FFCE31"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Manage Movie"
        component={MovieStack}
        options={{
          drawerIcon: ({ focused, size }) => (
            <MaterialCommunityIcons
              name="movie-roll"
              size={24}
              color={focused ? "#72C6A1" : "#FFCE31"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Manage Statistic"
        component={StatisticStack}
        options={{
          drawerIcon: ({ focused, size }) => (
            <AntDesign
              name="barschart"
              size={24}
              color={focused ? "#72C6A1" : "#FFCE31"}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function DrawerManager() {
  return <MyDrawer />;
}
