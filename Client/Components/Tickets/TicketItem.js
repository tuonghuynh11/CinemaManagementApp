import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import GlobalColors from "../../Color/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import { getDate } from "../../Helper/DateTime";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import FlatButton from "../UI/FlatButton";
import { useRef } from "react";

import * as ImagePicker from "expo-image-picker";
const deviceHeight = Dimensions.get("window").height;
const threshold = -deviceHeight * 0.05;
function TicketItem({
  idTicket,
  posterImage,
  dateTime,
  time,
  row,
  column,
  seats,
  onDelete,
  ticket,
  hall,
  isDisable,
  isNoBarCode,
  address,
}) {
  const day = getDay();
  const date = getDate(dateTime, true);

  function getDay() {
    var options = { weekday: "long" };
    var dayOfWeek = new Date(dateTime).toLocaleDateString("en-US", options);
    return dayOfWeek.split(", ")[0];
  }
  const dragY = useSharedValue(0);
  const isHide = useSharedValue(0);
  const panGesture = useAnimatedGestureHandler({
    onActive: (e) => {
      if (e.translationY > -93 && e.translationY < 0) {
        dragY.value = e.translationY;
      }
      console.log(e.translationY);
    },
    onEnd: (e) => {
      if (threshold < e.translationY) {
        dragY.value = withTiming(0);
      } else {
        // dragY.value = withTiming(-deviceHeight);
      }
    },
  });
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: dragY.value,
        },
      ],
    };
  });

  const rIconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(dragY.value < threshold ? 1 : 0);
    const bottom = isHide.value === 0 ? 40 : -200;
    return {
      opacity,
      bottom,
    };
  });
  function generateInvoiceCode(lengths = 10) {
    const length = lengths; // Change the length of the OTP as needed
    let code = "";
    const characters = "AWERTYUIPAFDAFSGGJJKG";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code + "E" + idTicket;

    // return code + "E" + ticket.reservationId;
  }
  function generateTextCode(lengths = 10) {
    const length = lengths; // Change the length of the OTP as needed
    let code = "";
    const characters = "AWERTYUIPAFDAFSGGJJKG";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code;

    // return code + "E" + ticket.reservationId;
  }
  const captureRefHandler = useRef();
  const [galleryPermissionInformation, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();

  async function verifyGalleryPermission() {
    if (
      galleryPermissionInformation.status ===
      ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (
      galleryPermissionInformation.status ===
      ImagePicker.PermissionStatus.DENIED
    ) {
      Alert.alert(
        "Insuficient Permission!",
        "You need to grant gallery permissions to change avatar"
      );

      return false;
    }
    return true;
  }
  const captureImage = async () => {
    // const hasPermission = await verifyGalleryPermission();
    // if (!hasPermission) {
    //   return;
    // }
    try {
      const localUri = await captureRef(captureRefHandler, {
        height: 980,
        width: 500,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <View style={styles.root}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TouchableNativeFeedback
          ref={captureRefHandler}
          onLongPress={() => {
            isHide.value = withTiming(0);

            dragY.value = withTiming(-93);
          }}
          onPress={() => {
            isHide.value = withTiming(1);
            dragY.value = withTiming(0);
          }}
          disabled={isDisable}
        >
          <Animated.View style={[styles.root, rStyle]}>
            <ImageBackground
              source={{
                uri: "https://image.tmdb.org/t/p/w500/" + posterImage,
              }}
              style={styles.imageBG}
            >
              <LinearGradient
                colors={["#ff552400", "#FF5524"]}
                style={styles.linearGradient}
              />
            </ImageBackground>
            <View style={styles.footer}>
              <View style={styles.borderStyle}>
                <View style={styles.halfLeftCircle}></View>
                <View
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 2,
                    borderColor: "orange",
                    margin: -2,
                    flex: 1,
                    marginHorizontal: 1,
                  }}
                ></View>
                <View style={styles.halfRightCircle}></View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginHorizontal: 30,
                  gap: 20,
                  marginTop: -10,
                }}
              >
                <View style={styles.dateTime}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.label}>Date: </Text>

                    {/* <Text style={styles.date}>{`${day}, ${date}`}</Text> */}
                    <Text style={styles.date}>{`${date}`}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.label}>Time: </Text>
                    <Text style={styles.date}>
                      {time + (parseInt(time.slice(0, 2)) < 12 ? " AM" : " PM")}
                    </Text>
                  </View>
                  <View style={[styles.dateContainer]}>
                    <Text style={[styles.label]}>Address: </Text>
                    <Text style={[styles.date]}>
                      {address?.length > 10
                        ? address?.slice(0, 10) + "..."
                        : address}
                    </Text>
                  </View>
                </View>

                <View style={styles.moreTicketInfo}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.label}>Row: </Text>
                    <Text style={styles.date}>{row}</Text>
                  </View>
                  <View style={styles.dateContainer}>
                    <Text style={styles.label}>Seats: </Text>

                    <Text style={styles.date}>{seats}</Text>
                  </View>
                  <View style={[styles.dateContainer]}>
                    <Text style={[styles.label]}>Hall: </Text>
                    <Text style={[styles.date]}>
                      {" "}
                      {hall?.length > 10 ? hall?.slice(0, 10) + "..." : hall}
                    </Text>
                  </View>
                </View>
              </View>

              {!isNoBarCode && (
                <View style={styles.imageContainer}>
                  <Barcode
                    style={{ backgroundColor: "#FF5524" }}
                    format="CODE128A"
                    value={generateInvoiceCode()}
                    height={50}
                    text={generateTextCode(20)}
                    maxWidth={260}
                  />
                </View>
              )}
            </View>
          </Animated.View>
        </TouchableNativeFeedback>
      </GestureHandlerRootView>
      <Animated.View style={[styles.deleteIconContainer, rIconContainerStyle]}>
        <Ionicons
          name="ios-trash-bin"
          size={40}
          color="red"
          onPress={onDelete}
        />
      </Animated.View>
      {!isNoBarCode && (
        <View style={{ marginBottom: -19 }}>
          <FlatButton onPress={captureImage}>
            <Text
              style={{
                fontSize: 15,
                color: GlobalColors.headerColor,
                textAlign: "center",
              }}
            >
              Download Ticket
            </Text>
          </FlatButton>
        </View>
      )}
    </View>
  );
}

export default TicketItem;
const dimensions = Dimensions.get("window");
const styles = StyleSheet.create({
  root: {
    height: "100%",
    paddingTop: 30,
    paddingBottom: 10,
    // marginHorizontal: 20,
    width: dimensions.width + 5,
  },
  linearGradient: {
    height: "70%",
  },
  imageBG: {
    alignSelf: "center",
    width: 300,
    aspectRatio: 235 / 300,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  borderStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  halfLeftCircle: {
    backgroundColor: GlobalColors.mainColor3,
    height: 70,
    width: 70,
    borderRadius: 35,
    marginLeft: -30,
  },
  halfRightCircle: {
    backgroundColor: GlobalColors.mainColor3,
    height: 70,
    width: 70,
    borderRadius: 35,
    marginRight: -30,
  },
  footer: {
    backgroundColor: "#FF5524",
    alignSelf: "center",
    width: 300,
    flex: 1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: "hidden",
  },
  dateTime: {
    justifyContent: "center",
    gap: 10,
    alignItems: "flex-start",
    marginTop: 10,
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  timeContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  time: {
    color: "white",
    fontSize: 10,
    paddingTop: 5,
  },
  date: {
    color: "white",
    fontSize: 13,
  },
  day: {
    color: "white",
    fontSize: 10,
    paddingTop: 5,
  },
  moreTicketInfo: {
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    marginTop: 10,
    gap: 10,
  },
  image: {
    width: 200,
    height: 60,
  },
  imageContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIconContainer: {
    alignSelf: "center",
    position: "absolute",
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#323232e4",
    justifyContent: "center",
    alignItems: "center",
  },
  label: { color: "#56147A", fontSize: 13, fontWeight: "bold" },
});
