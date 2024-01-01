import { View, StyleSheet, Text, Alert, Keyboard } from "react-native";
import AuthContent from "../../Components/Authentication/AuthContent";
import { useContext, useEffect, useState } from "react";
import Loading from "../../Components/UI/Loading";
import { AuthContext } from "../../Store/authContext";
import {
  CheckEmailExist,
  CheckPhoneNumberExist,
  CheckUserNameExist,
  Register,
} from "../../Util/databaseAPI";
import UserAccount from "../../Models/UserAccount";

function RegisterScreen({ navigation, route }) {
  const isPhoneNumber = route?.params?.isPhoneNumber;
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if (route?.params?.isModal || isPhoneNumber) {
      navigation.setOptions({
        presentation: "modal",
      });
    }
  }, []);
  async function signUpHandler({ email, phoneNumber, password, fullName }) {
    Keyboard.dismiss();
    setIsAuthenticating(true);
    // {
    //   "username": "string",
    //   "password": "string",
    //   "phoneNumber": "string",
    // "email":"",
    //   "role": "1"
    // }
    try {
      var user = new UserAccount();
      user.email = email;
      user.password = password;
      user.phoneNumber = phoneNumber;
      user.username = fullName;
      const isUserNameExists = await CheckUserNameExist(fullName);
      if (isUserNameExists) {
        Alert.alert("Authentication failed!", "UserName already exists");
        setIsAuthenticating(false);
        return;
      }
      if (isUserNameExists === null) {
        Alert.alert(
          "Connection Error!",
          "Please check your internet connection"
        );
        setIsAuthenticating(false);
        return;
      }
      if (email.length > 0) {
        // const data = await createUser(email, password);

        //Check email exists

        const isExists = await CheckEmailExist(email);
        if (isExists) {
          Alert.alert("Authentication failed!", "Email already exists");
          setIsAuthenticating(false);
          return;
        }
        if (isExists === null) {
          Alert.alert(
            "Connection Error!",
            "Please check your internet connection"
          );
          setIsAuthenticating(false);
          return;
        }
        //store account to database
        await Register(user);

        // addUserToDatabase({ email, phoneNumber, password, fullName });
        // authCtx.authenticate(data.idToken);
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login", params: { isRegister: true } }],
          });
        }, 2000);
      } else {
        const isExists = await CheckPhoneNumberExist(phoneNumber);
        if (isExists) {
          Alert.alert("Authentication failed!", "Phone number already exists");
          setIsAuthenticating(false);
          return;
        }
        if (isExists === null) {
          Alert.alert(
            "Connection Error!",
            "Please check your internet connection"
          );
          setIsAuthenticating(false);
          return;
        }
        // await Register(user);
        navigation.navigate("OTP", {
          phoneNumber: phoneNumber,
          isForgotPassword: false,
          password: password,
          fullName: fullName,
          user: user,
        });
        setIsAuthenticating(false);
      }
    } catch (err) {
      let errorMessage = err.response?.data?.errors;
      Alert.alert(
        "Authentication failed!",
        errorMessage
          ? errorMessage
          : "Could not create user. Please check your input and try again later!"
      );
      setIsAuthenticating(false);
    }
  }
  // if (isAuthenticating) {
  //   return <Loading message="Creating user..." />;
  // }

  return (
    <>
      {isAuthenticating && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Loading message="Creating user..." />
        </View>
      )}
      <View style={styles.root}>
        <Text style={styles.title}>Create Your Account</Text>
        <View style={styles.authContentContainer}>
          {isPhoneNumber && (
            <AuthContent isPhoneNumber onAuthenticate={signUpHandler} />
          )}
          {!isPhoneNumber && <AuthContent onAuthenticate={signUpHandler} />}
        </View>
      </View>
    </>
  );
}
export default RegisterScreen;
const styles = StyleSheet.create({
  root: {
    marginTop: 100,
    alignItems: "center",
  },
  authContentContainer: {
    width: "100%",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "600",
  },
});
