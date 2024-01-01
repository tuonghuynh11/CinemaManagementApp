import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageMovie from "../ManageMovie";
import AddMovie from "../AddMovie";

const Stack = createNativeStackNavigator();

export default function MovieStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ManageMovie" component={ManageMovie} />
        <Stack.Screen name="AddMovie" component={AddMovie} />
        
      </Stack.Navigator>
    );
  }