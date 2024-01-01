import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, LogBox, Pressable, ScrollView } from "react-native";
import { View, StyleSheet } from "react-native";
import IconButton from "../../Components/UI/IconButton";
import IconLabel from "../../Components/UI/IconLabel";
import IconLabelV2 from "../../Components/UI/IconLabelV2";
import { addDotsToNumber } from "../../Helper/NumberHelper";
import GlobalColors from "../../Color/colors";
import CustomButton from "../../Components/UI/CustomButton";
import { getDate, getDuration } from "../../Helper/DateTime";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { BookingContext } from "../../Store/bookingContext";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import {
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Loading from "../../Components/UI/Loading";
import FoodBeverageItemHistory from "../../Components/MovieTicket/FoodBeverageItemHistory";
import { CreateNewBill, GetAllDiscountOfUser } from "../../Util/databaseAPI";
import { AuthContext } from "../../Store/authContext";
import VNPAY from "../../Components/UI/VNPAY";
LogBox.ignoreLogs(["Webview process terminated"]);
function RecheckTicketScreen({ navigation, route }) {
  const {
    movieId,
    backdrop_path,
    foodBeverageCost,
    ticketCost,
    timeSelected,
    date,
    movieDetail,
    seats,
    cinemas,
    hallSelected,
    foodBeverage,
  } = {
    movieId: route.params.movieId,
    backdrop_path: route.params.backdrop_path,
    foodBeverageCost: route.params.foodBeverageCost,
    ticketCost: route.params.ticketCost,
    timeSelected: route.params.timeSelected,
    date: route.params.date,
    movieDetail: route.params.movieDetail,
    seats: route.params.seats,
    cinemas: route.params.cinemas,
    hallSelected: route.params.hallSelected,
    foodBeverage: route?.params?.foodBeverageInfo,
  };
  const bookingCtx = useContext(BookingContext);
  const authCtx = useContext(AuthContext);
  const isFocused = useIsFocused();
  useEffect(() => {
    console.log("run");
    if (isFocused) {
      bookingCtx.IsTimeout((curr) => !curr);
    }
  }, [isFocused]);
  function PriceItem({ title, price }) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 15, color: "white", opacity: 0.7 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 15, color: "white", opacity: 0.7 }}>
          $ {addDotsToNumber(price)}
        </Text>
      </View>
    );
  }

  ////Payment
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setPaymentIsLoading] = useState(false);
  const [paymentOption, setPaymentOption] = useState(0);
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const [discountList, setDiscountList] = useState([]);
  const [discountSelectedIndex, setDiscountSelectedIndex] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [isDiscountOption, seIsDiscountOption] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  const [ticketList, setTicketList] = useState([]);
  const ticketInfo = {
    movieId: route.params.movieId,
    backdrop_path: route.params.backdrop_path,
    foodBeverageCost: route.params.foodBeverageCost,
    ticketCost: route.params.ticketCost,
    timeSelected: route.params.timeSelected,
    date: route.params.date,
    movieDetail: route.params.movieDetail,
    seats: route.params.seats,
    cinemas: route.params.cinemas,
    hallSelected: route.params.hallSelected,
  }; //Mot doi thanh tripInfo
  const [cost, setCost] = useState(
    route.params.ticketCost + route.params.foodBeverageCost
  );

  useEffect(() => {
    console.log(bookingCtx.bookingInfo);
    //get discount list from database
    async function getDiscount() {
      const res = await GetAllDiscountOfUser(authCtx.idUser);
      if (!res || res.length === 0) {
        return;
      }
      console.log("discounts: ", res);
      const discounts = res?.map((item) => {
        if (item.usage) {
          return;
        }
        return {
          id: item.discountId,
          title: `Discount ${item.discount.percentage}%`,
          expireDate: new Date(item.discount.expireDate),
          value: item.discount.percentage,
          minimumPriceToApply: item.discount.minimumInvoice,
          maximumDiscountPrice: item.discount.maximumDiscount,
          status: item.usage,
        };
      });
      const filter = discounts.filter((discount) => {
        if (
          numberDaysBetweenTwoDays(new Date(), discount.expireDate) < 0 ||
          discount.status
        ) {
          return false;
        }
        return true;
      });
      setDiscountList(filter.sort((d1, d2) => d1.expireDate - d2.expireDate));
    }
    getDiscount();
  }, []);
  function numberDaysBetweenTwoDays(date1, date2) {
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }
  ///Test data
  function generateTicketById(ids) {
    const seatList = ticketInfo.seats.seats.split(", ");
    const rowList = ticketInfo.seats.rows.split(", ");

    const tickets = ids.map((id, index) => {
      return {
        reservationId: id,
        seatNumber: seatList[index],
        row: rowList[index],
      };
    });
    return tickets;
  }

  async function initializePaymentSheet() {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();
    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: "Example Inc.",
      allowsDelayedPaymentMethods: true,
      returnURL: "stripe-example://stripe-redirect",
    });

    if (!!error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      // setLoading(true);
    }
  }
  async function fetchPaymentSheetParams() {
    // const header = {
    //   accept: "application/json",
    //   Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJhZG1pbiIsInJvbGUiOnsiaWQiOiIzIiwicm9sZU5hbWUiOiJBZG1pbiJ9LCJpYXQiOjE3MDMzNDkyMzIsImV4cCI6MTcwMzM1MjgzMn0.2PsQlLX2MQgELqfXLmlwjQaUBDJNRd4vzC-wVaLavV4`,
    // };
    // const response = await axios.post(
    //   `https://coach-ticket-management-api.onrender.com/api/payment-sheet`,
    //   {
    //     cost:
    //       discountSelectedIndex !== null
    //         ? cost - cost * (discountList[discountSelectedIndex].value / 100)
    //         : cost,
    //   },
    //   {
    //     headers: header,
    //   }
    // );

    // const { paymentIntent, ephemeralKey, customer } = response.data.data;

    const header = {
      accept: "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJhZG1pbiIsInJvbGUiOnsiaWQiOiIzIiwicm9sZU5hbWUiOiJBZG1pbiJ9LCJpYXQiOjE3MDMzNDkyMzIsImV4cCI6MTcwMzM1MjgzMn0.2PsQlLX2MQgELqfXLmlwjQaUBDJNRd4vzC-wVaLavV4`,
    };

    const response = await axios.post(
      `https://payment-stripe-vnpay.onrender.com/stripe-payment/payment-sheet`,
      {
        cost:
          discountSelectedIndex !== null
            ? parseInt((cost - discountValue).toFixed(2) * 100)
            : parseInt(cost.toFixed(2) * 100),
      }
    );

    const { paymentIntent, ephemeralKey, customer } = response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  }

  async function showCreditCardHandler() {
    console.log();
    console.log("Credit card");
    const realCost =
      discountSelectedIndex !== null
        ? cost - cost * (discountList[discountSelectedIndex].value / 100)
        : cost;
    if (realCost === 0) {
      //Move to the ResultReceiptScreen
      //add ticket to database
      const responseId = [];
      const seats = ticketInfo.seats.seats.split(", ");
      for (var item of seats) {
        responseId.push(generateInvoiceCode());
      }
      bookingCtx.stopTimeout();
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "PaymentResultScreen",
            params: {
              status: 1, //0 :paylater,1:paid
              paymentMethod: "Credit Card",
              cost: realCost,
              tickets: ticketInfo,
              ticketList: generateTicketById(responseId),
            },
          },
        ],
      });
      return;
    }
    setPaymentOption(1);
    setIsLoading(true);
    await initializePaymentSheet();
    setIsLoading(false);
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log(error.message);
    } else {
      // Alert.alert(`Success`, "The payment was confirm successfully");
      //Them ve vao database voi status la 1
      //Lay thong tin tickets moi them vao database
      const discountID =
        discountSelectedIndex !== null
          ? discountList[discountSelectedIndex].id
          : null;
      let temp = bookingCtx.bookingInfo;
      temp.userId = parseInt(authCtx.idUser);
      if (discountID) {
        temp.discountId = parseInt(discountID);
      }
      console.log(temp);
      // return;
      setPaymentIsLoading((curr) => !curr);
      const res = await CreateNewBill(temp, true);
      if (!res) {
        Alert.alert(
          "Connection error",
          "Please check your internet connection"
        );
        setPaymentIsLoading((curr) => !curr);

        return;
      }
      console.log(res);
      const responseId = [];
      // const seats = ticketInfo.seats.seats.split(", ");
      for (var item of res?.ticketIds) {
        responseId.push(generateInvoiceCode(10, item));
      }
      bookingCtx.stopTimeout();
      setPaymentIsLoading((curr) => !curr);

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "PaymentResultScreen",
            params: {
              status: 1, //0 :paylater,1:paid
              paymentMethod: "Credit Card",
              cost: realCost,
              tickets: ticketInfo,
              ticketList: generateTicketById(responseId), //test data ,sau để ticket do API trả về
            },
          },
        ],
      });
    }
  }
  function addDotsToNumber(number) {
    if (number.toString() === "0") return "0";
    if (number) {
      number = number.toFixed(2);
    }
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function generateInvoiceCode(lengths = 10, ticketId = "") {
    const length = lengths; // Change the length of the OTP as needed
    let code = "";
    const characters = "AWERTYUIPAFDAFSGGJJKG";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    return code + "E" + ticketId;

    // return code + "E" + ticket.reservationId;
  }
  async function paymentHandler() {
    const realCost =
      discountSelectedIndex !== null
        ? cost - cost * (discountList[discountSelectedIndex].value / 100)
        : cost;
    ////Them ve vao database voi status la 0
    //add ticket to database
    // const responseId = [];
    // const seats = ticketInfo.seats.seats.split(", ");
    // for (var item of seats) {
    //   responseId.push(generateInvoiceCode());
    // }
    const discountID =
      discountSelectedIndex !== null
        ? discountList[discountSelectedIndex].id
        : null;
    let temp = bookingCtx.bookingInfo;
    temp.userId = parseInt(authCtx.idUser);
    if (discountID) {
      temp.discountId = parseInt(discountID);
    }
    console.log(temp);
    setPaymentIsLoading((curr) => !curr);
    const res = await CreateNewBill(temp, false);
    if (!res) {
      Alert.alert("Connection error", "Please check your internet connection");
      setPaymentIsLoading((curr) => !curr);

      return;
    }
    console.log(res);
    const responseId = [];
    // const seats = ticketInfo.seats.seats.split(", ");
    for (var item of res?.ticketIds) {
      responseId.push(generateInvoiceCode(10, item));
    }
    bookingCtx.stopTimeout();
    setPaymentIsLoading((curr) => !curr);

    bookingCtx.stopTimeout();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "PaymentResultScreen",
          params: {
            status: 0, //0 :paylater,1:paid
            paymentMethod: "Pay Later",
            cost: realCost,
            tickets: ticketInfo,
            ticketList: generateTicketById(responseId),
          },
        },
      ],
    });
  }
  function numberDaysBetweenTwoDays(date1, date2) {
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }
  function renderDiscountItem(itemData) {
    const numberOfDays = numberDaysBetweenTwoDays(
      new Date(),
      new Date(itemData.item.expireDate)
    );
    const isDisable = cost < itemData.item.minimumPriceToApply;
    return (
      <Pressable
        style={({ pressed }) => [
          styles.discountItem,
          pressed && { opacity: 0.5 },
          discountSelectedIndex === itemData.index && {
            borderColor: "#95c9f0",
            borderWidth: 1.5,
          },
          isDisable && {
            opacity: 0.5,
          },
        ]}
        disabled={isDisable}
        onPress={() => {
          if (discountSelectedIndex === itemData.index) {
            setDiscountSelectedIndex(null);
            setDiscountValue(0);
          } else {
            // id: item.discountId,
            // title: `Discount ${item.DiscountData.value * 100}%`,
            // expireDate: new Date(item.DiscountData.expireDate),
            // value: item.DiscountData.value * 100,
            // minimumPriceToApply: item.DiscountData.minimumpricetoapply,
            // maximumDiscountPrice: item.DiscountData.maximumdiscountprice,
            // status: item.status,

            const discountValue = (cost * itemData.item.value) / 100;
            if (discountValue > itemData.item.maximumDiscountPrice) {
              setDiscountValue(itemData.item.maximumDiscountPrice);
            } else {
              setDiscountValue(discountValue);
            }
            setDiscountSelectedIndex(itemData.index);
          }
          seIsDiscountOption((curr) => !curr);
        }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Image
            style={{ width: 40, height: 40 }}
            source={
              numberDaysBetweenTwoDays(new Date(), itemData.item.expireDate) >=
              3
                ? require("../../../icon/newDiscount.png")
                : require("../../../icon/oldDiscount.png")
            }
          />
          <View style={{ gap: 10 }}>
            <Text style={styles.discountTitle}>{itemData.item.title}</Text>
            <Text style={{ fontSize: 16, fontWeight: 400 }}>
              Minimum invoice{" "}
              <Text
                style={{
                  color: "red",
                  fontWeight: 600,
                }}
              >
                ${addDotsToNumber(itemData.item.minimumPriceToApply)}
              </Text>
            </Text>
            <View
              style={{
                padding: 2,
                borderWidth: 1,
                borderColor: "#f70010c5",
                alignItems: "flex-start",
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  color: "#f70010c5",
                  fontSize: 13,
                }}
              >
                Maximum ${addDotsToNumber(itemData.item.maximumDiscountPrice)}
              </Text>
            </View>
            {numberOfDays <= 4 && (
              <Text
                style={[
                  numberOfDays < 2 && { color: "red" },
                  {
                    fontSize: 13,
                  },
                ]}
              >
                Expire date : {getDate(itemData.item.expireDate)}
                {" ("}
                {numberOfDays.toFixed(0)}
                {numberOfDays >= 2 ? " days)" : " day)"}
              </Text>
            )}
            {numberOfDays > 4 && (
              <Text
                style={[
                  numberOfDays < 2 && { color: "red" },
                  {
                    fontSize: 13,
                  },
                ]}
              >
                Expire date : {getDate(itemData.item.expireDate)}
              </Text>
            )}
          </View>
        </View>
        {discountSelectedIndex === itemData.index && (
          <Ionicons
            name="radio-button-on"
            size={24}
            color={GlobalColors.headerColor}
          />
        )}
        {discountSelectedIndex !== itemData.index && (
          <Ionicons name="radio-button-off" size={24} color="black" />
        )}
      </Pressable>
    );
  }

  ////Payment
  async function paymentVNPAYHandler() {
    setIsWebView(false);
    const realCost =
      discountSelectedIndex !== null
        ? cost - cost * (discountList[discountSelectedIndex].value / 100)
        : cost;
    ////Them ve vao database voi status la 0
    //add ticket to database
    // const responseId = [];
    // const seats = ticketInfo.seats.seats.split(", ");
    // for (var item of seats) {
    //   responseId.push(generateInvoiceCode());
    // }

    const discountID =
      discountSelectedIndex !== null
        ? discountList[discountSelectedIndex].id
        : null;
    let temp = bookingCtx.bookingInfo;
    temp.userId = parseInt(authCtx.idUser);
    if (discountID) {
      temp.discountId = parseInt(discountID);
    }
    console.log("Temp:", temp);
    // return;
    setPaymentIsLoading((curr) => !curr);
    const res = await CreateNewBill(temp, true);
    if (!res) {
      Alert.alert(
        "VNPT Connection error",
        "Please check your internet connection"
      );
      setPaymentIsLoading((curr) => !curr);

      return;
    }
    console.log(res);
    const responseId = [];
    // const seats = ticketInfo.seats.seats.split(", ");
    for (var item of res?.ticketIds) {
      responseId.push(generateInvoiceCode(10, item));
    }
    setPaymentIsLoading((curr) => !curr);

    bookingCtx.stopTimeout();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "PaymentResultScreen",
          params: {
            status: 1, //0 :paylater,1:paid
            paymentMethod: "Credit Card",
            cost: realCost,
            tickets: ticketInfo,
            ticketList: generateTicketById(responseId),
          },
        },
      ],
    });
  }
  function paymentByVNPAYHandler() {
    setIsWebView((curr) => !curr);
  }
  async function VNPAYHandler(status) {
    switch (status) {
      case "success":
        await paymentVNPAYHandler();
        break;
      case "fail":
        setIsWebView(false);

        break;
      case "exit":
        setIsWebView(false);

        break;
      default:
        break;
    }
  }
  return (
    <>
      {isWebView && (
        <VNPAY
          amount={(cost - discountValue) * 24000}
          isVisible={isWebView}
          closeModal={VNPAYHandler}
        />
      )}

      {isPaymentLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: GlobalColors.lightBackground,
            opacity: 0.5,
          }}
        >
          <Loading />
        </View>
      )}
      <Modal
        visible={isDiscountOption}
        style={styles.modal}
        animationType="slide"
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: GlobalColors.lightBackground,
              height: "53%",
              width: "100%",
              borderRadius: 20,
              padding: 10,
            }}
          >
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => seIsDiscountOption((curr) => !curr)}
            >
              <Ionicons name="close-circle-outline" size={24} color="white" />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: -20,
                color: "white",
              }}
            >
              Your Discounts
            </Text>
            <View
              style={{
                width: "100%",
                height: 10,
                borderBottomColor: "white",
                borderBottomWidth: 1,
                opacity: 0.4,
              }}
            />
            <FlatList
              style={{ marginVertical: 10, marginBottom: 15 }}
              data={discountList}
              renderItem={(itemData) => renderDiscountItem(itemData)}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <View style={styles.header}>
          <IconButton
            icon={"chevron-back"}
            size={30}
            color={"white"}
            onPress={() => {
              navigation.goBack();
              bookingCtx.stopTimeout();
              bookingCtx.resetTimeout();
            }}
          />
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "center",
            textAlign: "center",
            marginTop: -30,
            width: "100%",
          }}
        >
          Master Cinemas
        </Text>
      </View>

      <ScrollView style={styles.root}>
        <ImageBackground
          defaultSource={require("../../../icon/defaultmovie.png")}
          source={{
            uri: "https://image.tmdb.org/t/p/w500" + backdrop_path,
          }}
          imageStyle={{ borderRadius: 0 }}
          style={styles.imageBG}
        >
          <LinearGradient
            colors={["#24204b40", "#08031df3"]}
            style={styles.linearGradient}
          ></LinearGradient>
        </ImageBackground>

        <View style={styles.body}>
          <Text
            style={{
              color: "white",
              fontSize: 15,
              alignSelf: "center",
              marginBottom: 25,
            }}
          >
            Order Summary
          </Text>
          <Text style={styles.title}>{movieDetail.title.toUpperCase()}</Text>
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <IconLabel
              icon={"time"}
              color={"white"}
              size={30}
              title={getDuration(movieDetail.runtime)}
              textStyle={{ fontSize: 15 }}
            />
            <IconLabel
              icon={"calendar"}
              color={"white"}
              size={30}
              title={
                `${date.day}, ${getDate(new Date().setDate(date.date), true)}` +
                " | " +
                timeSelected +
                (parseInt(timeSelected.slice(0, 2)) < 12 ? " AM" : " PM")
              }
              textStyle={{ fontSize: 15 }}
            />
            <IconLabel
              icon={"location-sharp"}
              color={"white"}
              size={30}
              title={cinemas.address}
              textStyle={{ fontSize: 15 }}
            />
            <IconLabelV2
              icon={"seat"}
              color={"white"}
              size={30}
              title={seats.seats.split(", ").length + " Seats selected "}
              textStyle={{ fontSize: 15 }}
            />
            <IconLabelV2
              icon={"ticket-confirmation"}
              color={"white"}
              size={30}
              title={"Seat " + seats.seats}
              textStyle={{ fontSize: 15 }}
            />

            <View
              style={{
                padding: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name="meeting-room" size={30} color="white" />
              <Text
                style={{
                  fontSize: 15,
                  color: "white",
                  marginStart: 5,
                }}
                numberOfLines={2}
              >
                Hall {hallSelected.auditoriumName}
              </Text>
            </View>
          </View>
        </View>

        {/* Food & Drink */}
        <View style={styles.secondBody}>
          <View
            style={{
              padding: 5,
              borderRadius: 10,
              backgroundColor: GlobalColors.validate,
              maxWidth: 200,
              alignItems: "center",
            }}
          >
            <Text style={styles.subTitle}>
              {" "}
              Food & Beverages ({foodBeverage?.length})
            </Text>
          </View>

          {foodBeverage?.length !== 0 && (
            <FlatList
              data={foodBeverage}
              keyExtractor={(item, index) => index}
              renderItem={(itemData) => (
                <FoodBeverageItemHistory item={itemData.item} />
              )}
              horizontal
              ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
              showsHorizontalScrollIndicator={false}
            />
          )}
          {foodBeverage?.length === 0 && (
            <Text
              style={{
                fontSize: 16,
                color: "white",
                opacity: 0.7,
                marginBottom: 0,
              }}
            >
              No food or beverage was chosen
            </Text>
          )}
        </View>
        {/* Food & Drink */}

        {/* Discount - Payment */}
        <View style={styles.subRoot}>
          {isLoading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            >
              <Loading />
            </View>
          )}
          <StripeProvider
            publishableKey={
              "pk_test_51MhlhmBI7ZTpJ5xJUpmkPO48Z8X6ckuQeAN1Rcm9d88jUNlJCawJ1MFKYxPbqZFUeURK3M7m3jhCjdI3KXksOwf100gFkPoIL5"
            }
          >
            {/* <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                alignSelf: "center",
                textAlign: "center",
                maxWidth: 300,
              }}
            >
              Select the payment method you want to use
            </Text> */}
            <View style={styles.subBody}>
              <View style={{ gap: 10 }}>
                <View
                  style={{
                    padding: 5,
                    borderRadius: 10,
                    backgroundColor: GlobalColors.validate,
                    width: 100,
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.subTitle}>Discount</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "white",
                      marginBottom: 10,
                      paddingLeft: 0,
                      borderRadius: 10,
                      paddingVertical: 5,
                    },
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => seIsDiscountOption((curr) => !curr)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 5,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="ticket-percent-outline"
                      size={24}
                      color="red"
                    />
                    <Text
                      style={{
                        color: "black",
                        fontWeight: "500",
                        opacity: 0.4,
                      }}
                    >
                      {" "}
                      Your voucher
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginRight: 5,
                    }}
                  >
                    <Text
                      style={[
                        styles.subTitle,
                        { color: "black", fontWeight: "500", opacity: 0.4 },
                      ]}
                    >
                      {discountSelectedIndex !== null
                        ? "Discount " +
                          discountList[discountSelectedIndex].value +
                          "%"
                        : "add voucher"}
                    </Text>
                    <FontAwesome name="angle-right" size={24} color="black" />
                  </View>
                </Pressable>
              </View>

              <View>
                <View
                  style={{
                    padding: 5,
                    borderRadius: 10,
                    backgroundColor: GlobalColors.validate,
                    width: 160,
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.subTitle}>Payment Method</Text>
                </View>
                <View style={styles.paymentContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      // setIsWebView((curr) => !curr);
                      setPaymentOption(0);
                    }}
                    style={[
                      styles.paymentSubContainer,
                      paymentOption === 0 && styles.optionSelected,
                    ]}
                  >
                    <View style={styles.paymentIconContainer}>
                      <Ionicons
                        name="wallet-outline"
                        size={24}
                        color={GlobalColors.price}
                      />
                      <Text style={{ fontWeight: "600" }}>Paylater</Text>
                    </View>
                    <CustomButton color={"#4bb5f6ff"}>Active Now</CustomButton>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentSubContainer,
                      paymentOption === 1 && styles.optionSelected,
                    ]}
                    onPress={() => setPaymentOption(1)}
                  >
                    <View style={styles.paymentIconContainer}>
                      <FontAwesome
                        name="credit-card"
                        size={24}
                        color={GlobalColors.price}
                      />
                      <Text style={{ fontWeight: "600" }}>Credit Card</Text>
                    </View>
                    <IconButton
                      icon={"chevron-down-outline"}
                      size={24}
                      color={"black"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.paymentSubContainer,
                      paymentOption === 2 && styles.optionSelected,
                    ]}
                    onPress={() => {
                      setPaymentOption(2);
                    }}
                  >
                    <View style={styles.paymentIconContainer}>
                      <FontAwesome
                        name="credit-card"
                        size={24}
                        color={GlobalColors.price}
                      />
                      <Text style={{ fontWeight: "600" }}>VNPAY</Text>
                    </View>
                    <IconButton
                      icon={"chevron-down-outline"}
                      size={24}
                      color={"black"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </StripeProvider>
        </View>
        {/* Discount - Payment */}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={{ fontSize: 14, color: "white", opacity: 0.6 }}>
          Price Details
        </Text>
        <Text style={styles.paymentTitle}>Ticket Subtotal</Text>
        <PriceItem
          title={
            seats.seats.split(", ").length +
            " Ticket(s) $" +
            addDotsToNumber(ticketCost / seats.seats.split(", ").length) +
            "/ticket"
          }
          price={ticketCost}
        />
        <PriceItem title={"Food & Beverages"} price={foodBeverageCost} />
        <Text style={styles.paymentTitle}>Discount</Text>
        <PriceItem title={"Voucher"} price={-discountValue} />

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
            Total
          </Text>
          <Text style={{ fontSize: 20, color: "red", fontWeight: "bold" }}>
            $ {addDotsToNumber(cost - discountValue)}
          </Text>
        </View>
        <View>
          <CustomButton
            color={GlobalColors.mainColor1}
            onPress={() => {
              if (paymentOption === 0) {
                paymentHandler();
              } else if (paymentOption === 2) {
                paymentByVNPAYHandler();
              } else {
                showCreditCardHandler();
              }
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {paymentOption === 0 ? "Pay Later" : "Pay Now"}
            </Text>
          </CustomButton>
        </View>
      </View>
    </>
  );
}
export default RecheckTicketScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GlobalColors.lightBackground,
    marginBottom: 80,
  },
  header: {
    flexDirection: "row",
    // marginTop: 40,
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  imageBG: {
    width: "100%",
    aspectRatio: 972 / 1327,
    borderRadius: 20,
    position: "absolute",
    opacity: 0.6,
  },
  linearGradient: {
    height: "100%",
    zIndex: 1,
    flex: 1,
  },
  body: {
    marginTop: 160,
    justifyContent: "flex-start",
    alignItems: "center",
    height: 360,
    // zIndex: -1,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    maxWidth: 350,
    alignSelf: "center",
  },
  footer: {
    flex: 1,
    // marginTop: 90,
    // marginBottom: 10,
    padding: 20,
    gap: 10,
    paddingTop: 25,
    justifyContent: "flex-end",
    zIndex: 1,
    backgroundColor: GlobalColors.background,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.2,
    borderTopColor: "gray",
  },
  paymentTitle: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  subRoot: {
    flex: 1,
  },
  subBody: {
    paddingHorizontal: 20,
    marginBottom: 105,
    paddingBottom: 130,
    marginTop: 15,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  pickUpSeat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    // paddingTop: 20,
    paddingHorizontal: 20,
    height: 120,
    backgroundColor: GlobalColors.lightBackground,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  yourTripBody: {
    gap: 10,
  },
  passengerItem: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  passengerItemInfo: {
    gap: 5,
    justifyContent: "center",
  },
  passengerItemRoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "white",
    alignItems: "center",
    marginVertical: 7,
  },
  paymentContainer: {
    marginVertical: 7,
    marginTop: 10,
    gap: 10,
  },
  paymentSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
  },
  paymentIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  creditCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 70,
    height: 50,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 6,
  },
  imageContainer: {},
  optionSelected: { borderWidth: 3, borderColor: GlobalColors.button },
  modal: {
    flex: 1,
  },
  discountItem: {
    padding: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
  },
  title1: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.price,
    marginBottom: 10,
  },
  discountTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    marginTop: 40,
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  secondBody: {
    marginTop: 30,
    marginHorizontal: 20,
    gap: 10,
  },
});
