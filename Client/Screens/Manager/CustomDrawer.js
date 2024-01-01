import React, { useContext, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import placeholder from "../../../assets/noStaffImg.jpg";
import { MaterialIcons } from "@expo/vector-icons";
import LogOutPopUp from "../../Components/UI/LogOutPopUp";
import { AuthContext } from "../../Store/authContext";
import Loading from "../../Components/UI/Loading";

const { width } = Dimensions.get("screen");

export default function CustomDrawer(props) {
  const [image, setImage] = useState();
  const [name, setName] = useState("username");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const authCtx = useContext(AuthContext);
  const logoutHandler = () => {
    setIsLogoutVisible((curr) => !curr);
  };
  return (
    <>
      {isLoading && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: "100%",
            width: "150%",
            zIndex: 100,
            backgroundColor: GlobalColors.lightBackground,
            opacity: 0.9,
          }}
        >
          <Loading message={"Logging out ..."} />
        </View>
      )}
      <LogOutPopUp
        isVisible={isLogoutVisible}
        onCancel={() => {
          setIsLogoutVisible((curr) => !curr);
        }}
        onLogout={() => {
          setIsLogoutVisible(false);
          setIsLoading(true);
          setTimeout(async () => {
            setIsLoading(false);
            // await logOut({
            //   userName: authCtx.userName,
            //   accessToken: authCtx.token,
            //   refreshToken: authCtx.refreshToken,
            // });
            authCtx.logout();
          }, 2000);
        }}
      />
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{
            backgroundColor: "#0C1941",
            flex: 1,
          }}
        >
          <ImageBackground
            source={require("../../../assets/cinema.jpg")}
            style={{ padding: 30, paddingLeft: 10, height: 150, zIndex: 100 }}
          >
            <Image
              source={image ? { uri: image } : placeholder}
              style={styles.staffImage}
            />
          </ImageBackground>
          <View style={styles.botView}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>
        <View style={styles.custom}>
          <Pressable
            style={({ pressed }) => [
              styles.press,
              pressed && { opacity: 0.85 },
            ]}
            onPress={logoutHandler}
          >
            <MaterialIcons name="logout" size={24} color="#FFCE31" />
            <Text
              style={{ fontWeight: "500", color: "#FFCE31", marginLeft: 30 }}
            >
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  staffImage: {
    width: 100,
    height: 100,
    borderRadius: 80,
    borderColor: "#FFCE31",
    position: "absolute",
    borderWidth: 1,
    zIndex: 100,
    bottom: -50,
    left: (width * 1) / 3 - 100,
  },
  name: {
    color: "#0C1941",
    marginLeft: 15,
    marginTop: 5,
  },
  botView: {
    flex: 1,
    backgroundColor: "#0C1941",
    paddingTop: 55,
  },
  custom: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#FFCE31",
    backgroundColor: "#0C1941",
  },
  press: {
    flexDirection: "row",
  },
});
