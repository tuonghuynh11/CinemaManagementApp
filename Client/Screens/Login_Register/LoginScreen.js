import { Alert, Image, Keyboard, StyleSheet, Text, View } from "react-native";
import AuthContent from "../../Components/Authentication/AuthContent";
import { useContext, useEffect, useState } from "react";
import Loading from "../../Components/UI/Loading";
import { AuthContext } from "../../Store/authContext";
import { Login } from "../../Util/databaseAPI";
import PopUp from "../../Components/UI/PopUp";

function LoginScreen({ navigation, route }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);
  const isPhoneNumber = route?.params?.isPhoneNumber;
  const [isFromRegister, setIsFromRegister] = useState(false);
  const [isFromResetPassword, setIsFromResetPassword] = useState(false);
  useEffect(() => {
    if (route?.params?.isModal || isPhoneNumber) {
      navigation.setOptions({
        presentation: "modal",
      });
    }
    if (route?.params?.isRegister) {
      setIsFromRegister(true);
    }
    if (route?.params?.isResetPassword) {
      setIsFromResetPassword(true);
    }
  }, []);

  async function loginHandler({ email, phoneNumber, password }) {
    setIsAuthenticating(true);
    Keyboard.dismiss();
    try {
      var user = {};
      var isEmail = email.includes("@");
      if (isEmail) {
        user.email = email;
      } else {
        user.userName = email;
      }
      user.password = password;
      user.phoneNumber = phoneNumber;
      if (!!email) {
        // const data = await login(email, password);
        // authCtx.authenticate(data.idToken);

        const data = await Login(user);
        if (data === null) {
          if (isEmail) {
            throw "Email/Password was wrong";
          } else {
            throw "UserName/Password was wrong";
          }
        }
        console.log("user login:", data);

        authCtx.authenticate(
          data.accessToken,
          data.refreshToken,
          data.userId.toString(),
          data.userName,
          data.roleId.toString(),
          data?.idPosition ? data?.idPosition : "12"
        );
      } else {
        //phone number
        //Mốt thay bằng access token
        user.userName = phoneNumber;
        const data = await Login(user);
        console.log("user login:", data);
        if (data === null) {
          throw "PhoneNumber/Password was wrong";
        }
        console.log("Phone Number");
        authCtx.authenticate(
          data.accessToken,
          data.refreshToken,
          data.userId.toString(),
          data.userName,
          data.roleId.toString(),
          data?.idPosition ? data?.idPosition : "12"
        );
      }
    } catch (err) {
      const errorMessage = err;
      Alert.alert(
        "Authentication failed!",
        errorMessage
          ? errorMessage
          : "Could not log you in. Please check your credentials or try again later!"
      );
      setIsAuthenticating(false);
    }
  }
  // if (isAuthenticating) {
  //   return <Loading message="Logging you in..." />;
  // }

  return (
    <>
      {isFromRegister && (
        <PopUp
          type={"Success"}
          isVisible={isFromRegister}
          title={"Create Account Successful"}
          textBody={"Please login with your credentials"}
          callback={() => {
            setIsFromRegister((curr) => !curr);
          }}
        />
      )}
      {isFromResetPassword && (
        <PopUp
          type={"Success"}
          isVisible={isFromResetPassword}
          title={"Reset password successfully"}
          textBody={"Please login with your credentials"}
          callback={() => {
            setIsFromResetPassword((curr) => !curr);
          }}
        />
      )}

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
          <Loading message="Logging you in..." />
        </View>
      )}
      <View style={styles.root}>
        <Image
          style={styles.image}
          source={require("../../../assets/logo.png")}
        ></Image>
        <Text style={styles.title}>Welcome to Faster</Text>
        <View style={styles.authContentContainer}>
          {isPhoneNumber && (
            <AuthContent isLogin isPhoneNumber onAuthenticate={loginHandler} />
          )}
          {!isPhoneNumber && (
            <AuthContent isLogin onAuthenticate={loginHandler} />
          )}
        </View>
      </View>
    </>
  );
}
export default LoginScreen;
const styles = StyleSheet.create({
  root: {
    marginTop: 100,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  authContentContainer: {
    width: "100%",
  },
  image: {
    marginTop: -100,
    marginBottom: -80,
    width: 300,
    height: 300,
  },
});
