import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageFoodDrink from "../ManageFoodDrink";
import AddFoodDrink from "../AddFoodDrink";
import ManageCinemaMenu from "../ManageCinemaMenu";
import AddMenu from "../AddMenu";

const Stack = createNativeStackNavigator();

export default function FoodDrinkStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ManageFoodDrink" component={ManageFoodDrink} />
        <Stack.Screen name="AddFoodDrink" component={AddFoodDrink} />
        <Stack.Screen name="ManageCinemaMenu" component={ManageCinemaMenu} />
        <Stack.Screen name="AddMenu" component={AddMenu} />
        
      </Stack.Navigator>
    );
  }