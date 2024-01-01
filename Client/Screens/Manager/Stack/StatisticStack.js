import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageStatistic from "../ManageStatistic";
const Stack = createNativeStackNavigator();

export default function StatisticStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ManageMovie" component={ManageStatistic} />
        
      </Stack.Navigator>
    );
  }