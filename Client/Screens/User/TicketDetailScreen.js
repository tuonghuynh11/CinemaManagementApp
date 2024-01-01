import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "react-native";
import { View, StyleSheet } from "react-native";
import IconButton from "../../Components/UI/IconButton";
import { Text } from "react-native";
import IconLabel from "../../Components/UI/IconLabel";
import IconLabelV2 from "../../Components/UI/IconLabelV2";
import { addDotsToNumber } from "../../Helper/NumberHelper";
import GlobalColors from "../../Color/colors";
import CustomButton from "../../Components/UI/CustomButton";
import { getDate, getDuration, getTime } from "../../Helper/DateTime";
import { MaterialIcons } from "@expo/vector-icons";
import FoodBeverageItemHistory from "../../Components/MovieTicket/FoodBeverageItemHistory";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import FlatButton from "../../Components/UI/FlatButton";
function TicketDetailScreen({ navigation, route }) {
  const {
    movieId,
    backdrop_path,
    foodBeverageCost,
    ticketCost,
    totalCost,
    discountCost,
    timeSelected,
    date,
    movieDetail,
    seats,
    rows,
    address,
    hallSelected,
    foodBeverage,
  } = {
    movieId: route.params.movieDetail.id,
    backdrop_path: route.params.movieDetail.poster_path,
    foodBeverageCost: route.params.ticketDetail.ordersCost,
    ticketCost: route.params.ticketDetail.ticketsCost,
    totalCost: route.params.ticketDetail.totalCost,
    discountCost:
      route.params.ticketDetail.discountCost == 0
        ? 0
        : -1 * route.params.ticketDetail.discountCost,
    timeSelected: route.params.ticketDetail.time,
    date: route.params.ticketDetail.dateTime,
    movieDetail: route.params.movieDetail,
    seats: route.params.ticketDetail.seats,
    rows: route.params.ticketDetail.rows,
    address: route.params.ticketDetail.address,
    hallSelected: route.params.ticketDetail.hall,
    foodBeverage: route.params.ticketDetail.foodBeverage,
  };
  const day = getDay();
  const dates = getDate(route.params.ticketDetail.dateTime, true);

  function getDay() {
    var options = { weekday: "long" };
    var dayOfWeek = new Date(date).toLocaleDateString("en-US", options);
    return dayOfWeek.split(", ")[0];
  }
  function addDotsToNumberss(number) {
    if (number.toString() === "0") return "0";
    if (number) {
      number = number.toFixed(2);
    }
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  // const foodBeverage = [
  //   {
  //     id: 1,
  //     image:
  //       "https://www.cinesystem.com.br/bomboniere/images/combos/combo-max-duplo.png",
  //     title: "Regular Combo",
  //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
  //     price: 100000,
  //     quantitySelected: 0,
  //   },
  //   {
  //     id: 2,
  //     image:
  //       "https://purepng.com/public/uploads/large/purepng.com-popcornfood-box-corn-bucket-popcorn-movie-film-cinema-941524633493b9owo.png",
  //     title: "PopCorn",
  //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
  //     price: 70000,
  //     quantitySelected: 0,
  //   },
  //   {
  //     id: 3,
  //     image:
  //       "https://www.cinesystem.com.br/bomboniere/images/combos/combo-max-duplo.png",
  //     title: "Regular Combo",
  //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
  //     price: 70000,
  //     quantitySelected: 0,
  //   },
  //   {
  //     id: 4,
  //     image:
  //       "https://purepng.com/public/uploads/large/purepng.com-popcornfood-box-corn-bucket-popcorn-movie-film-cinema-941524633493b9owo.png",
  //     title: "PopCorn",
  //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
  //     price: 70000,
  //     quantitySelected: 2,
  //   },
  // ];
  function PriceItem({ title, price }) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 15, color: "white", opacity: 0.7 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 15, color: "white", opacity: 0.7 }}>
          $ {addDotsToNumberss(price)}
        </Text>
      </View>
    );
  }

  ///Test
  ///Test data
  function generateTicketById(seats, rows) {
    const seatList = seats.split(", ");
    const rowList = rows.split(", ");
    const ids = [];
    for (let i = 0; i < seatList.length; i++) {
      ids.push(Math.floor(Math.random() * (100 - 10 + 1)) + 10);
    }
    const tickets = ids.map((id, index) => {
      return {
        reservationId: id,
        seatNumber: seatList[index],
        row: rowList[index],
      };
    });
    return tickets;
  }
  ///Test

  function getTimeStringFromDate(rawDate) {
    try {
      let date = new Date(rawDate);
      let hour = date.getHours();
      let minutes = date.getMinutes();

      hour = hour < 10 ? `0${hour}` : hour;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${hour}:${minutes}`;
    } catch (error) {
      return;
    }
  }
  function goToTicketListScreen() {
    navigation.navigate("ElectronicTicketScreen", {
      status: 1,
      paymentMethod: "Credit Card",
      dateTime: date,
      cost: totalCost,
      tickets: {
        seats: {
          seats: seats,
          rows: rows,
        },
        date: {
          date: date.getDate(),
        },
        movieDetail: movieDetail,
        timeSelected: getTimeStringFromDate(timeSelected),
        hallSelected: {
          auditoriumName: hallSelected,
        },
        cinemas: {
          id: 1,
          name: "Cinema 1",
          seats: 30,
          address: address,
          times: [
            "08:00",
            "10:00",
            "12:00",
            "13:30",
            "14:30",
            "16:00",
            "18:00",
            "20:00",
          ],
          freeHalls: [
            [1, 2, 3, 4, 5],
            [9, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
          ],
        },
      },
      isHistory: true,

      ticketList: generateTicketById(seats, rows),
    });
  }
  function addDotsToNumberss(number) {
    if (number.toString() === "0") return "0";
    if (number) {
      number = number.toFixed(2);
    }
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return (
    <View style={styles.root}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <IconButton
            icon={"chevron-back"}
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "center",
            textAlign: "center",
            marginLeft: 40,
            // marginTop: -35,
            // width: "100%",
          }}
        >
          Master Cinemas
        </Text>
        <View style={{ alignSelf: "center", zIndex: 1 }}>
          <FlatButton onPress={goToTicketListScreen}>
            <Text
              style={{
                fontSize: 18,
                color: GlobalColors.mainColor2,
              }}
            >
              Tickets
            </Text>
          </FlatButton>
        </View>
      </View>
      <ScrollView
        style={[styles.root, { marginBottom: 25 }]}
        showsVerticalScrollIndicator={false}
      >
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
        {/* <View style={styles.header}>
          <IconButton
            icon={"chevron-back"}
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "center",
            textAlign: "center",
            marginTop: -35,
            width: "100%",
          }}
        >
          Master Cinemas
        </Text> */}
        <Text
          style={{
            color: "white",
            fontSize: 15,
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          Order Summary
        </Text>
        {/* <View style={{ marginTop: -55, alignSelf: "flex-end", zIndex: 1 }}>
          <FlatButton onPress={goToTicketListScreen}>
            <Text
              style={{
                fontSize: 18,
                color: GlobalColors.mainColor2,
              }}
            >
              Tickets
            </Text>
          </FlatButton>
        </View> */}
        <View style={styles.body}>
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
              title={`${day}, ${dates} | ${getTime(timeSelected)}`}
              textStyle={{ fontSize: 15 }}
            />
            <IconLabel
              icon={"location-sharp"}
              color={"white"}
              size={30}
              title={address}
              textStyle={{ fontSize: 15 }}
            />
            <IconLabelV2
              icon={"seat"}
              color={"white"}
              size={30}
              title={seats.split(", ").length + " Seats selected "}
              textStyle={{ fontSize: 15 }}
            />
            <IconLabelV2
              icon={"ticket-confirmation"}
              color={"white"}
              size={30}
              title={"Seat " + seats}
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
                Hall {hallSelected}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.secondBody}>
          <Text style={{ fontSize: 16, color: "white", opacity: 0.7 }}>
            Food & Beverages {"(" + foodBeverage.length + ")"}
          </Text>
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
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={{ fontSize: 14, color: "white", opacity: 0.6 }}>
          Price Details
        </Text>
        <Text style={styles.paymentTitle}>Ticket Subtotal</Text>
        <PriceItem
          title={
            seats.split(", ").length +
            " Ticket(s) " +
            addDotsToNumberss(ticketCost / seats.split(", ").length) +
            "/ticket"
          }
          price={ticketCost}
        />
        <PriceItem title={"Food & Beverages"} price={foodBeverageCost} />
        {/* <PriceItem title={"Discount"} price={discountCost} />
        <Text style={styles.paymentTitle}>Fee & Tax</Text>
        <PriceItem title={"Rebate"} price={0} /> */}
        <Text style={styles.paymentTitle}>Discount</Text>
        <PriceItem title={"Voucher"} price={discountCost} />
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 20, color: "yellow", fontWeight: "bold" }}>
            Total
          </Text>
          <Text style={{ fontSize: 20, color: "yellow", fontWeight: "bold" }}>
            $ {addDotsToNumberss(totalCost)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default TicketDetailScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    // alignItems: "center",
  },
  titles: {
    fontSize: 13,
    color: "white",
  },
  header: {
    flexDirection: "row",
    marginTop: 40,
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
    marginTop: 50,
    justifyContent: "flex-start",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    maxWidth: 320,
    alignSelf: "center",
  },
  footer: {
    // marginTop: 90,
    padding: 20,
    gap: 10,
    paddingTop: 25,
    justifyContent: "flex-end",
    backgroundColor: GlobalColors.lightBackground,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 30,
  },
  paymentTitle: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  secondBody: {
    marginTop: 120,
    marginBottom: 270,
    paddingHorizontal: 5,
    gap: 10,
  },
});
