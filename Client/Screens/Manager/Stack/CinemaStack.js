import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageCinema from "../ManageCinema";
import AddCinema from "../AddCinema";
import ManageShowtime from "../ManageShowtime";
import AddShowTime from "../AddShowTime";

const Stack = createNativeStackNavigator();

export default function CinemaStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ManageCinema" component={ManageCinema} />
        <Stack.Screen name="AddCinema" component={AddCinema} />
        <Stack.Screen name="ManageShowtime" component={ManageShowtime} />
        <Stack.Screen name="AddShowTime" component={AddShowTime} />
        
      </Stack.Navigator>
    );
  }