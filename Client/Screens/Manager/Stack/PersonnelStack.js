import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageStaff from "../ManageStaff";
import AddManager from "../AddManager";
import AddStaff from "../AddStaff";

const Stack = createNativeStackNavigator();

export default function PersonnelStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ManageStaff" component={ManageStaff} />
        <Stack.Screen name="AddManager" component={AddManager} />
        <Stack.Screen name="AddStaff" component={AddStaff} />
        
      </Stack.Navigator>
    );
  }