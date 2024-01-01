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
import OTP from "./Client/Components/Authentication/OTPForm";
import ForgotPassword from "./Client/Components/Authentication/ForgotPassword";
import ResetPassword from "./Client/Components/Authentication/ResetPassword";
import HomeNavigation from "./Client/Navigation/HomeNavigation";
import MovieDetailScreen from "./Client/Screens/User/MovieDetailScreen";
import SelectCinemaScreen from "./Client/Screens/User/SelectCinemaScreen";
import BookSeatScreen from "./Client/Screens/User/BookSeatScreen";
import SelectFoodBeverageScreen from "./Client/Screens/User/SelectFoodBeverageScreen";
import FlatButton from "./Client/Components/UI/FlatButton";
import RecheckTicketScreen from "./Client/Screens/User/RecheckTicketScreen";
import PaymentScreen from "./Client/Screens/User/PaymentScreen";
import PaymentResultScreen from "./Client/Screens/User/PaymentResultScreen";
import ElectronicTicketScreen from "./Client/Screens/User/ElectronicTicketScreen";
import TicketDetailScreen from "./Client/Screens/User/TicketDetailScreen";
import TicketHistoryDetailScreen from "./Client/Screens/User/TicketHistoryDetailScreen";
import EditProfileScreen from "./Client/Screens/User/EditProfileScreen";
import AboutUsScreen from "./Client/Screens/User/AboutUsScreen";
import MyOfferingScreen from "./Client/Screens/User/MyOfferingScreen";
import MoreMovieListScreen from "./Client/Screens/User/MoreMovieListScreen";
import BookingContextProvider from "./Client/Store/bookingContext";
import MovieScheduleOfCinemaScreen from "./Client/Screens/User/MovieScheduleOfCinemaScreen";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
export default function App() {
  LogBox.ignoreLogs([
    "No native ExpoFirebaseCore module found, are you sure the expo-firebase-core module is linked properly?",
  ]);
  LogBox.ignoreLogs(["Webview Process Terminated"]);

  function AuthStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor: GlobalColors.background,
          },
          presentation: "transparentModal",
          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: "",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={RegisterScreen}
          options={{
            title: "",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="OTP"
          component={OTP}
          options={{
            title: "",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            title: "Forgot Password",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            title: "Create New Password",
            contentStyle: {
              backgroundColor: GlobalColors.background,
            },
            presentation: "card",
          }}
        />
      </Stack.Navigator>
    );
  }
  function AuthenticatedStack({ roleId }) {
    //Check each role has a different navigation
    //If user
    if (roleId == 1) {
      return (
        <BookingContextProvider>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeNavigation}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MoreMovieListScreen"
              component={MoreMovieListScreen}
              options={{
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: false,
                contentStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
                // presentation: "modal",
              }}
            />
            <Stack.Screen
              name="MovieScheduleOfCinemaScreen"
              component={MovieScheduleOfCinemaScreen}
              options={{
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: false,
                contentStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
                // presentation: "modal",
              }}
            />
            <Stack.Screen
              name="MovieDetailScreen"
              component={MovieDetailScreen}
              options={{
                title: "Movie Detail",
                // presentation: "modal",
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerTintColor: "white",
              }}
            />

            <Stack.Screen
              name="SelectCinemaScreen"
              component={SelectCinemaScreen}
              options={{
                title: "",
                // presentation: "modal",
                headerShown: false,
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                // headerTintColor: GlobalColors.back_btn,
              }}
            />
            <Stack.Screen
              name="BookSeatScreen"
              component={BookSeatScreen}
              options={{
                title: "",
                // presentation: "modal",
                headerShown: false,
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                // headerTintColor: GlobalColors.back_btn,
              }}
            />

            <Stack.Screen
              name="SelectFoodBeverageScreen"
              component={SelectFoodBeverageScreen}
              options={{
                title: "Food & Beverage",
                // presentation: "modal",
                headerShown: true,
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                },
                headerBackVisible: true,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="RecheckTicketScreen"
              component={RecheckTicketScreen}
              options={{
                title: "Master Cinemas",
                // presentation: "modal",
                gestureEnabled: false,
                headerShown: false,
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                },
                headerBackVisible: true,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{
                title: "Master Cinemas",
                // presentation: "modal",
                gestureEnabled: false,

                headerShown: false,
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                },
                headerBackVisible: true,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="PaymentResultScreen"
              component={PaymentResultScreen}
              options={{
                title: "Payment Result",
                // presentation: "modal",
                gestureEnabled: false,

                headerShown: true,
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: true,
                headerTitleStyle: {
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                },
                headerBackVisible: true,
                headerTintColor: "white",
              }}
            />

            <Stack.Screen
              name="ElectronicTicketScreen"
              component={ElectronicTicketScreen}
              options={{
                title: "Electronic Tickets",
                // presentation: "modal",
                gestureEnabled: false,

                headerShown: true,
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: true,
                headerTitleStyle: {
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                },
                headerBackVisible: true,
                headerTintColor: "white",
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="TicketDetailScreen"
              component={TicketDetailScreen}
              options={{
                title: "Ticket Details",
                // presentation: "modal",
                headerShown: false,
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: true,
                headerTitleStyle: {
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                },
                headerBackVisible: true,
                headerTintColor: "white",
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="TicketHistoryDetailScreen"
              component={TicketHistoryDetailScreen}
              options={{
                title: "Booked History",
                // presentation: "modal",
                headerShown: false,
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: true,
                headerTitleStyle: {
                  color: "white",
                  fontSize: 20,
                  fontWeight: "bold",
                },
                headerBackVisible: true,
                headerTintColor: "white",
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
              options={{
                gestureEnabled: false,
                title: "Edit Profile",
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="MyOfferingScreen"
              component={MyOfferingScreen}
              options={{
                title: "Offering",
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                  fontWeight: "bold",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="AboutUsScreen"
              component={AboutUsScreen}
              options={{
                title: "About Us",
                headerStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                  color: "white",
                  fontWeight: "bold",
                },
                headerShown: true,
                contentStyle: {
                  backgroundColor: GlobalColors.mainColor3,
                },
                headerBackVisible: true,
                headerBackTitleVisible: false,
                headerTintColor: "white",
              }}
            />
          </Stack.Navigator>
        </BookingContextProvider>
      );
    }

    //Staff
    else if (roleId == 2) {
    }
    //Manager
    else if (roleId == 3) {
    }
    //Admin
    else {
    }
  }
  function Navigation() {
    //check isAuthenticated
    //If isAuthenticated then skip login
    //else login or register
    const authCtx = useContext(AuthContext);
    return (
      <NavigationContainer
        style={styles.container}
        theme={{
          colors: {
            backgroundColor: GlobalColors.mainColor3,
            background: GlobalColors.mainColor3,
          },
        }}
      >
        {/* <AuthenticatedStack /> */}
        {/* <AuthStack /> */}
        {authCtx.isAuthenticated && (
          <AuthenticatedStack roleId={authCtx.idRole} />
        )}
        {!authCtx.isAuthenticated && <AuthStack />}
      </NavigationContainer>
    );
  }
  function Root() {
    //add loading when run app
    const [isTryLoading, setIsTryLoading] = useState(true);
    const authCtx = useContext(AuthContext);
    useEffect(() => {
      async function fetchToken() {
        const token = await AsyncStorage.getItem("token");
        const idUser = await AsyncStorage.getItem("idUser");
        const userName = await AsyncStorage.getItem("userName");
        const idRole = await AsyncStorage.getItem("idRole");
        const idPosition = await AsyncStorage.getItem("idPosition");
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (token) {
          authCtx.authenticate(
            token,
            refreshToken,
            idUser,
            userName,
            idRole,
            idPosition
          );
        }
        setIsTryLoading(false);
      }
      fetchToken();
    }, []);
    if (isTryLoading) {
      return <Loading />;
    }
    return <Navigation />;
  }

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
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
