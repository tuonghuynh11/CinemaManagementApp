import { useContext, useEffect, useState } from "react";
import { Image, Text } from "react-native";
import { View, StyleSheet } from "react-native";
import GlobalColors from "../../Color/colors";
import CustomButton from "../../Components/UI/CustomButton";
import { getDate, getTime } from "../../Helper/DateTime";
import { LogBox } from "react-native";
import { BookingContext } from "../../Store/bookingContext";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

function PaymentResultScreen({ navigation, route }) {
  const [paymentInfo, setPaymentInfo] = useState({});
  const bookingCtx = useContext(BookingContext);
  useEffect(() => {
    bookingCtx.clearBookingInfo();
    bookingCtx.clearMovie();
    setPaymentInfo({
      status: route.params.status,
      paymentMethod: route.params.paymentMethod,
      dateTime: new Date(),
      cost: route.params.cost,
      tickets: route.params.tickets,
      invoiceCode: generateInvoiceCode(),
    });
    console.log(route.params.cost);
  }, []);
  function generateInvoiceCode() {
    const length = 10; // Change the length of the OTP as needed
    let code = "";
    const characters = "0123456789AHFKEXEWQ";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
  }
  // const paymentInfo = {
  //   status: 0,
  //   paymentMethod: "Credit Cart",
  //   dateTime: new Date(),
  //   cost: 100000,
  //   tickets: [],
  //   invoiceCode: generateInvoiceCode(),
  // };
  function addDotsToNumber(number) {
    try {
      if (number?.toString() === "0") return "0";
      if (number) {
        number = number.toFixed(2);
      }
      if (number)
        return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } catch (error) {
      console.log(error);
    }
  }
  function SubBody({ title1, subTitle1, title2, subTitle2 }) {
    return (
      <View style={styles.subBody}>
        <View style={{ gap: 5 }}>
          <Text style={styles.title}>{title1}</Text>
          <Text style={styles.subTitle}>{subTitle1}</Text>
        </View>
        <View style={{ gap: 5, alignItems: "flex-end" }}>
          <Text style={styles.title}>{title2}</Text>
          <Text style={styles.subTitle}>{subTitle2}</Text>
        </View>
      </View>
    );
  }
  function returnHomeHandler() {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  }
  function ViewTickets() {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "ElectronicTicketScreen",
          params: {
            status: route.params.status,
            paymentMethod: route.params.paymentMethod,
            dateTime: new Date(),
            cost: route.params.cost,
            tickets: route.params.tickets,
            ticketList: route.params.ticketList,
          },
        },
      ],
    });
  }
  return (
    <View style={{ flex: 1, justifyContent: "flexStart" }}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Image
            style={styles.image}
            source={
              paymentInfo.status === 1
                ? require("../../../icon/Success.png")
                : require("../../../icon/Warning.png")
            }
          />
          <Text style={styles.headerTitle}>
            {paymentInfo.status === 1
              ? "Your payment was successful!"
              : "Your invoice has not been paid yet!!.\n Please go to cinema ticket sales points to pay "}
          </Text>
          <View style={{ overflow: "hidden", marginTop: 15, width: "100%" }}>
            <View
              style={{
                borderStyle: "dashed",
                borderWidth: 2,
                borderColor: "gray",
                margin: -2,
                marginTop: 0,
                opacity: 0.4,
              }}
            ></View>
          </View>
        </View>
        <View style={styles.body}>
          <SubBody
            title1={"Invoice Number"}
            subTitle1={paymentInfo.invoiceCode}
            title2={"Payment Method"}
            subTitle2={paymentInfo.paymentMethod}
          />
          <SubBody
            title1={"Date"}
            subTitle1={getDate(paymentInfo.dateTime)}
            title2={"Time"}
            subTitle2={getTime(paymentInfo.dateTime)}
          />
          <SubBody
            title1={"Amount Paid"}
            subTitle1={addDotsToNumber(paymentInfo.cost) + " $"}
            title2={"Status"}
            subTitle2={paymentInfo.status === 1 ? "Successful" : "Unpaid"}
          />
        </View>
        <View style={{ margin: 10 }}>
          <CustomButton radius={10} color={"#cac6c665"} onPress={ViewTickets}>
            <Text
              style={{
                textAlign: "center",
                color: "#1C6AE4",
                fontSize: 16,
              }}
            >
              View Ticket
            </Text>
          </CustomButton>
        </View>
      </View>

      <View
        style={{
          margin: 10,
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          marginHorizontal: 20,
        }}
      >
        <CustomButton
          radius={10}
          color={GlobalColors.mainColor1}
          onPress={returnHomeHandler}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Return to home
          </Text>
        </CustomButton>
      </View>
    </View>
  );
}
export default PaymentResultScreen;
const styles = StyleSheet.create({
  root: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 30,
    backgroundColor: "white",
    borderRadius: 10,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "black",
    paddingBottom: 10,
    borderStyle: "solid",
  },
  image: {
    height: 150,
    width: 170,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
  },
  body: {
    padding: 20,
    gap: 30,
  },
  subBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    opacity: 0.5,
  },
  subTitle: {
    fontSize: 16,
  },
});
