import { StatusBar } from "expo-status-bar";
import { LogBox, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import GlobalColors from "./Client/Color/colors";
import LoginScreen from "./Client/Screens/Login_Register/LoginScreen";
import RegisterScreen from "./Client/Screens/Login_Register/RegisterScreen";
import AuthContextProvider, { AuthContext } from "./Client/Store/authContext";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "./Client/Components/UI/Loading";

import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import ManageMovie from "./Client/Screens/Manager/ManageMovie";
import ManageStaff from "./Client/Screens/Manager/ManageStaff";
import ManageCinema from "./Client/Screens/Manager/ManageCinema";
import ManageManager from "./Client/Screens/Manager/ManageManager";
import ManageStatistic from "./Client/Screens/Manager/ManageStatistic";
import ManageFoodDrink from "./Client/Screens/Manager/ManageFoodDrink";
import AddCinema from "./Client/Screens/Manager/AddCinema";
import AddManager from "./Client/Screens/Manager/AddManager";
import AddStaff from "./Client/Screens/Manager/AddStaff";
import AddFoodDrink from "./Client/Screens/Manager/AddFoodDrink";
import AddMenu from "./Client/Screens/Manager/AddMenu";
import ManageCinemaMenu from "./Client/Screens/Manager/ManageCinemaMenu";
import AddMovie from "./Client/Screens/Manager/AddMovie";
import ManageShowtime from "./Client/Screens/Manager/ManageShowtime";
import AddShowTime from "./Client/Screens/Manager/AddShowTime";
import Drawer from "./Client/Screens/Manager/Drawer";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
//const Drawer = createDrawerNavigator();
export default function App() {
  LogBox.ignoreLogs([
    "No native ExpoFirebaseCore module found, are you sure the expo-firebase-core module is linked properly?",
  ]);
  function AuthStack() {
    // return (
    //   <Stack.Navigator
    //     screenOptions={{
    //       headerBackTitleVisible: false,
    //       headerStyle: {
    //         backgroundColor: GlobalColors.background,
    //       },
    //       presentation: "transparentModal",
    //       headerTintColor: "white",
    //     }}
    //   >
    //     <Stack.Screen
    //       name="Login"
    //       component={LoginScreen}
    //       options={{
    //         title: "",
    //         contentStyle: {
    //           backgroundColor: GlobalColors.background,
    //         },
    //         presentation: "card",
    //         headerShown: false,
    //       }}
    //     />
    //     <Stack.Screen
    //       name="Signup"
    //       component={RegisterScreen}
    //       options={{
    //         title: "",
    //         contentStyle: {
    //           backgroundColor: GlobalColors.background,
    //         },
    //         presentation: "card",
    //         headerShown: false,
    //       }}
    //     />
    //     <Stack.Screen
    //       name="OTP"
    //       component={OTP}
    //       options={{
    //         title: "",
    //         contentStyle: {
    //           backgroundColor: GlobalColors.background,
    //         },
    //         presentation: "card",
    //       }}
    //     />
    //     <Stack.Screen
    //       name="ForgotPassword"
    //       component={ForgotPassword}
    //       options={{
    //         title: "Forgot Password",
    //         contentStyle: {
    //           backgroundColor: GlobalColors.background,
    //         },
    //         presentation: "card",
    //       }}
    //     />
    //     <Stack.Screen
    //       name="ResetPassword"
    //       component={ResetPassword}
    //       options={{
    //         title: "Create New Password",
    //         contentStyle: {
    //           backgroundColor: GlobalColors.background,
    //         },
    //         presentation: "card",
    //       }}
    //     />
    //   </Stack.Navigator>
    // );
  }
  function AuthenticatedStack() {
    //Check each role has a different navigation
    //If user

    return (
      <Stack.Navigator>
        <Stack.Screen
          name="HomeScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );

    //Staff

    //Manager

    //Admin
  }
  function Navigation() {
    //check isAuthenticated
    //If isAuthenticated then skip login
    //else login or register
    // const authCtx = useContext(AuthContext);
    return (
      <NavigationContainer
        style={styles.container}
        // theme={{
        //   colors: {
        //     backgroundColor: GlobalColors.second_background,
        //     background: GlobalColors.second_background,
        //   },
        // }}
      >
        <AuthenticatedStack />
        {/* {authCtx.isAuthenticated && <AuthenticatedStack />}
        {!authCtx.isAuthenticated && <AuthStack />} */}
      </NavigationContainer>
    );
  }
  function Root() {
    //add loading when run app
    // const [isTryLoading, setIsTryLoading] = useState(true);
    // const authCtx = useContext(AuthContext);
    // useEffect(() => {
    //   async function fetchToken() {
    //     const token = await AsyncStorage.getItem("token");
    //     if (token) {
    //       authCtx.authenticate(token);
    //     }
    //     setIsTryLoading(false);
    //   }
    //   fetchToken();
    // }, []);
    // if (isTryLoading) {
    //   return <Loading />;
    // }
    return <Navigation />;
  }

  return (
    <>
      <StatusBar style="auto" />
      {/* <AuthContextProvider>
        <Root />
      </AuthContextProvider> */}
      <Drawer />
    </>
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
