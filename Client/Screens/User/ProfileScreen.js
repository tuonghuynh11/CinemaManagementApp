import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Store/authContext";
import CircleImage from "../../Components/UI/CircleImage";
import GlobalColors from "../../Color/colors";
import { MaterialIcons } from "@expo/vector-icons";
import LogOutPopUp from "../../Components/UI/LogOutPopUp";
import Loading from "../../Components/UI/Loading";
import FeedbackAppModal from "./FeedbackAppModal";
import { addDotsToNumber } from "../../Helper/NumberHelper";
import {
  GetAllBillOfUserV2,
  GetCurrentUserInformation,
} from "../../Util/databaseAPI";
import { useIsFocused } from "@react-navigation/native";
import VNPAY from "../../Components/UI/VNPAY";

function ProfileScreen({ navigation, route }) {
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [memberShip, setMemberShip] = useState("gold");
  const [totalCost, setTotalCost] = useState(0);
  const [currentUser, setCurrentUser] = useState({});
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  useEffect(() => {
    //getMemberShip
    async function getUserInfo() {
      const info = await GetCurrentUserInformation(authCtx.idUser);
      if (!info) {
        Alert.alert(
          "Connection error",
          "Please connect your internet connection"
        );
        return;
      }
      console.log(info);
      setCurrentUser(info);
      const res = await GetAllBillOfUserV2(authCtx.idUser);
      if (!res || res.length === 0) {
        return;
      }
      let totalCost = 0;
      res?.forEach((element) => {
        totalCost +=
          element?.discountCost + element?.ordersCost + element?.ticketsCost;
      });
      setTotalCost(totalCost);
    }
    if (isFocused) {
      getUserInfo();
    }
  }, [isFocused]);
  function BodyItem({ children, title }) {
    return (
      <View style={styles.bodyItem}>
        <Text
          style={{
            color: GlobalColors.button,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {title}
        </Text>
        {children}
      </View>
    );
  }
  function BodySubItem({ title, onPress, isHotLine, hotline, isNotSymbol }) {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            backgroundColor: "#a8dfeb",
            borderRadius: 10,
            alignItems: "center",
          },
          pressed && { opacity: 0.7 },
        ]}
        onPress={onPress}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>{title}</Text>
        {isHotLine && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              color: "red",
              paddingVertical: 3,
            }}
          >
            {hotline}
          </Text>
        )}
        {!isNotSymbol && (
          <MaterialIcons name="chevron-right" size={24} color="black" />
        )}
      </Pressable>
    );
  }

  function editProfileHandler() {
    navigation.navigate("EditProfileScreen", {
      currentUser: currentUser,
    });
  }
  async function makeCallHandler() {
    if (Platform.OS === "android") {
      await Linking.openURL("tel:0123456789");
    } else {
      await Linking.openURL("telprompt:0123456789");
    }
  }
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
            zIndex: 1,
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
          setTimeout(() => {
            setIsLoading(false);
            authCtx.logout();
          }, 2000);
        }}
      />
      <FeedbackAppModal
        isVisible={isFeedbackVisible}
        onCancel={() => {
          setIsFeedbackVisible((curr) => !curr);
        }}
        onSubmit={() => {}}
        defaultEmail={"b@gmail.com"}
      />
      <SafeAreaView style={styles.root}>
        <ScrollView style={[styles.root, { marginBottom: 35 }]}>
          <View style={styles.subRoot}>
            <View
              style={{
                width: "100%",
                alignItems: "flex-end",
                justifyContent: "space-between",
                alignItems: "center",
                // alignSelf: "flex-end",
                marginTop: -45,
                marginBottom: -60,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  padding: 5,
                  backgroundColor: GlobalColors.button,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontWeight: "600", color: "white" }}>
                  Member
                </Text>
              </View>
              <Image
                style={{ width: 50, height: 70 }}
                source={
                  memberShip === "gold"
                    ? require("../../../icon/gold.png")
                    : memberShip === "silver"
                    ? require("../../../icon/silver.png")
                    : require("../../../icon/bronze.png")
                }
              />
            </View>

            <CircleImage
              // image={
              //   "https://cdn.tgdd.vn/Files/2022/02/21/1416573/bill-gates-la-ai_1280x860-800-resize.jpg"
              // }
              size={100}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={[styles.title, { color: "white" }]}>
                {authCtx.userName}
              </Text>
              {/* <TouchableOpacity onPress={editProfileHandler}>
              <MaterialIcons name="edit" size={24} color="#72C6A1" />
            </TouchableOpacity> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 20,
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "#c87018",
                  borderRadius: 10,
                  padding: 5,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "400", color: "white" }}
                >
                  Total Spending
                </Text>
                <Text
                  style={{ fontSize: 17, fontWeight: "600", color: "#0bc653" }}
                >
                  {addDotsToNumber(totalCost.toFixed(2))} $
                </Text>
              </View>
              {/* <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  backgroundColor: "#19a075",
                  borderRadius: 10,
                  padding: 5,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "400", color: "white" }}
                >
                  Reward Point
                </Text>
                <Text
                  style={{ fontSize: 17, fontWeight: "600", color: "yellow" }}
                >
                  121
                </Text>
              </View> */}
            </View>
            <View
              style={{
                width: "100%",
                backgroundColor: GlobalColors.lightBackground,
                borderRadius: 20,
                padding: 10,
                alignItems: "center",
              }}
            >
              <View style={{ width: "100%" }}>
                <BodyItem title={"Information"}>
                  <BodySubItem
                    title={"Personal Information"}
                    onPress={editProfileHandler}
                  />
                  <BodySubItem
                    title={"Ordered History"}
                    onPress={() =>
                      navigation.navigate("TicketHistoryDetailScreen")
                    }
                  />
                </BodyItem>
              </View>
              <View style={styles.body}>
                <BodyItem title={"Promotions and Offering"}>
                  <BodySubItem
                    title={"My Offering"}
                    onPress={() => {
                      navigation.navigate("MyOfferingScreen");
                    }}
                  />
                </BodyItem>
                <BodyItem title={"FAQ’s & Support"}>
                  <BodySubItem
                    onPress={makeCallHandler}
                    title={"HotLine"}
                    isHotLine
                    hotline={"0123456789"}
                    isNotSymbol
                  />
                  <BodySubItem
                    title={"About Us"}
                    onPress={() => {
                      navigation.navigate("AboutUsScreen");
                    }}
                  />
                  <BodySubItem
                    onPress={() => {
                      setIsFeedbackVisible((curr) => !curr);
                    }}
                    title={"Feedback"}
                  />
                </BodyItem>

                {/* <BodyItem>
                <BodySubItem
                  title={"Log out"}
                  onPress={() => {
                    setIsLogoutVisible((curr) => !curr);
                  }}
                />
              </BodyItem> */}
                <View style={{ alignItems: "center" }}>
                  <Pressable
                    style={({ pressed }) => [
                      {
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        padding: 10,
                        backgroundColor: "#8692e2",
                        borderRadius: 10,
                        alignItems: "center",
                        gap: 10,
                      },
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => {
                      setIsLogoutVisible((curr) => !curr);
                    }}
                  >
                    <MaterialIcons
                      name="power-settings-new"
                      size={24}
                      color="black"
                    />
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>
                      {"Log out"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* <Image
            style={{ width: 200, height: 80 }}
            source={require("../../../assets/logo_transparent.png")}
          /> */}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export default ProfileScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    // backgroundColor: GlobalColors.contentBackground,
    gap: 20,
  },
  subRoot: {
    // backgroundColor: "white",
    alignItems: "center",
    margin: 20,
    borderRadius: 20,
    padding: 10,
    gap: 10,
    paddingVertical: 20,
  },
  title: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  body: {
    width: "100%",
    marginTop: 20,
    gap: 20,
  },
  bodyItem: {
    gap: 10,
  },
});
