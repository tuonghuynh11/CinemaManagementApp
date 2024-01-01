import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import IconLabel from "../../Components/UI/IconLabel";
import { Ticket } from "../../Models/Ticket";
import { addNewTicket } from "../../Util/firebase";
import { AuthContext } from "../../Store/authContext";
import IconButton from "../../Components/UI/IconButton";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { FontAwesome } from "@expo/vector-icons";
import { addDotsToNumber } from "../../Helper/NumberHelper";
import GlobalColors from "../../Color/colors";
import { BookingContext } from "../../Store/bookingContext";
import { GetAvailableSeatByShowTimeId } from "../../Util/databaseAPI";
import Loading from "../../Components/UI/Loading";
function BookSeatScreen({ navigation, route }) {
  const [seats, setSeats] = useState(generateSeat());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  const [cost, setCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);

  const [timeSelected, setTimeSelected] = useState(route.params.timeSelected);
  const [hallSelected, setHallSelected] = useState(
    route.params.cinemas.freeHalls[
      findTimeSelectedIndex(route.params.timeSelected)
    ][0]
  );
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const ticketPrice = route.params.price;
  const cinemas = route.params.cinemas;

  const times = route.params.times.map((time, index) => {
    return { key: index, value: time };
  });

  const bookingCtx = useContext(BookingContext);
  function findTimeSelectedIndex(timess) {
    const index = route.params.times.indexOf(timess);
    return index;
  }
  useEffect(() => {
    //load time, poster, price
    async function getAvailableSeat() {
      setIsLoading((curr) => !curr);
      const res = await GetAvailableSeatByShowTimeId(
        route.params.cinemas.freeHalls[
          findTimeSelectedIndex(route.params.timeSelected)
        ][0]?.showtimeId
      );
      if (!res) {
        setIsLoading(false);

        return;
      }
      setSeats(generateSeat(res));
      console.log("availableSeats: ", res);
      setIsLoading((curr) => !curr);
    }
    getAvailableSeat();
  }, []);
  function checkSeatAvailable(row, col, availableSeatArray) {
    const isAvailable = availableSeatArray.find(
      (item) => item.rowNumber == row && item.colNumber == col
    );
    if (isAvailable) {
      return isAvailable.id;
    }
    return null;
  }
  function generateSeat(availableSeatArray = []) {
    const numberRow = 10;
    let numberColumn = 3;

    let rowArray = [];
    let reach = false;

    let start = 1;
    for (let i = 0; i < numberRow; i++) {
      let columnArray = [];
      for (let j = 0; j < numberColumn; j++) {
        let seatObject = {
          number: start,
          // taken: Boolean(Math.round(Math.random())),
          taken: !Boolean(checkSeatAvailable(i + 1, j + 1, availableSeatArray)),
          selected: false,
          row: i + 1,
          col: j + 1,
          id: checkSeatAvailable(i + 1, j + 1, availableSeatArray)
            ? checkSeatAvailable(i + 1, j + 1, availableSeatArray)
            : Math.round(Math.random()),
        };
        start++;
        columnArray.push(seatObject);
      }
      if (i === 2) {
        numberColumn -= 2;
      }
      if (i === 4) {
        reach = true;
      }
      if (reach) {
        if (i == 4 || i == 6) {
          numberColumn += 2;
        }
        numberColumn -= 2;
      } else {
        numberColumn += 2;
      }

      rowArray.push(columnArray);
    }
    return rowArray;
  }

  function selectedSeatHandler(index, subindex, number) {
    if (seats[index][subindex].taken) {
      return;
    }
    let temp = [...seats];
    let numberOfSeat = selectedSeats.length;
    temp[index][subindex].selected = !temp[index][subindex].selected;
    if (temp[index][subindex].selected) {
      setSelectedSeats((curr) => [...curr, temp[index][subindex]]);
      numberOfSeat += 1;
    } else {
      setSelectedSeats((curr) => curr.filter((item) => item.number !== number));
      numberOfSeat -= 1;
    }
    setSeats(temp);
    setCost(ticketPrice * numberOfSeat);
  }
  async function buyTicketHandler() {
    console.log("buyTicketHandler");
    if (selectedSeats.length === 0) {
      Alert.alert("Warning", "Please select a number of seats");
      return;
    }
    let rows = "";
    let seats = "";
    selectedSeats.sort((a, b) => a.number - b.number);
    selectedSeats.forEach((item, index) => {
      if (index == selectedSeats.length - 1) {
        rows += "0" + item.row;
        seats += "0" + item.number;
      } else {
        rows += "0" + item.row + ", ";
        seats += "0" + item.number + ", ";
      }
    });
    const seat = {
      rows: rows,
      seats,
    };
    console.log(selectedSeats);
    const temp = { ...bookingCtx.bookingInfo };
    temp.seatIds = selectedSeats.map((item) => item.id);
    bookingCtx.setBookingInfo(temp);
    navigation.navigate("SelectFoodBeverageScreen", {
      movieId: route.params.movieId,
      backdrop_path: route.params.backdrop_path,
      totalCost: cost,
      timeSelected: timeSelected,
      date: route.params.date,
      movieDetail: route.params.movieDetail,
      seats: seat,
      cinemas: route.params.cinemas,
      hallSelected: hallSelected,
    });
  }

  function selectTimeHandler() {
    console.log("adfd", timeSelected);
    // if (isFirstTime) {
    //   setIsFirstTime((curr) => !curr);
    //   return;
    // }
    setTimeModalVisible((curr) => !curr);
  }
  return (
    <>
      <Modal
        visible={timeModalVisible}
        backdropOpacity={0.7}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "'rgba(0,0,0,0.5)'",
            borderRadius: 30,
            zIndex: 1,
            width: "100%",
            flex: 1,
          }}
        >
          <View
            style={{
              width: 200,
              backgroundColor: "#0F193E",
              paddingVertical: 20,
              height: 100,
              borderRadius: 20,
            }}
          >
            <SelectList
              boxStyles={styles.selectList1}
              setSelected={async (val) => {
                setTimeSelected(val);
                setHallSelected(
                  cinemas.freeHalls[findTimeSelectedIndex(val)][0]
                );
                const { showtimeId, cinemaId } = { ...bookingCtx.bookingInfo };
                bookingCtx.setBookingInfo({
                  showtimeId:
                    cinemas.freeHalls[findTimeSelectedIndex(val)][0]
                      ?.showtimeId,
                  cinemaId: cinemaId,
                });
                setIsLoading(true);
                const availableSeat = await GetAvailableSeatByShowTimeId(
                  cinemas.freeHalls[findTimeSelectedIndex(val)][0]?.showtimeId
                );
                if (!availableSeat) {
                  return;
                }
                setSelectedSeats([]);
                setSeats(generateSeat(availableSeat));
                setCost(0);
                setIsLoading(false);
              }}
              data={times}
              save="value"
              search={false}
              arrowicon={
                <FontAwesome name="chevron-down" size={12} color={"white"} />
              }
              inputStyles={{
                fontSize: 15,
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                alignSelf: "center",
              }}
              dropdownStyles={{
                backgroundColor: "#0F193E",
                borderWidth: 1,
                marginHorizontal: 5,
                textAlign: "center",
              }}
              dropdownItemStyles={{
                borderBottomWidth: 0.17,
                borderColor: "gray",
                width: "100%",
                alignItems: "center",
              }}
              dropdownTextStyles={{ color: "white" }}
              onSelect={selectTimeHandler}
            />
          </View>
        </View>
      </Modal>
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <IconButton
            icon={"chevron-back-outline"}
            color={"white"}
            size={30}
            onPress={() => navigation.goBack()}
          />
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Master Cinemas
          </Text>
          <IconButton
            icon={"time-outline"}
            color={"white"}
            size={30}
            onPress={() => setTimeModalVisible((curr) => !curr)}
          />
        </View>
        <Text style={{ color: "white", fontSize: 15, alignSelf: "center" }}>
          Choose Seats
        </Text>
        <Text
          style={{
            color: "#73ef0e",
            fontSize: 15,
            alignSelf: "flex-end",
            marginTop: -20,
            marginRight: 10,
          }}
        >
          {timeSelected}
        </Text>
        <ImageBackground
          defaultSource={require("../../../icon/defaultmovie.png")}
          source={{
            uri: "https://image.tmdb.org/t/p/w500" + route.params.backdrop_path,
          }}
          imageStyle={{ borderRadius: 0 }}
          style={styles.imageBG}
        >
          <LinearGradient
            colors={["#24204b40", "#08031df3"]}
            style={styles.linearGradient}
          ></LinearGradient>
        </ImageBackground>
        {isLoading && <Loading />}
        {!isLoading && (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Image source={require("../../../icon/Screen.png")} />
            <View style={styles.container}>
              {seats.map((item, index) => {
                return (
                  <View key={index} style={styles.seatRow}>
                    {item.map((seat, subindex) => {
                      return (
                        <TouchableOpacity
                          key={seat.number}
                          onPress={() => {
                            selectedSeatHandler(index, subindex, seat.number);
                          }}
                        >
                          <MaterialIcons
                            name="event-seat"
                            size={20}
                            color={
                              seat.taken
                                ? "#585656"
                                : !seat.selected
                                ? "white"
                                : "orange"
                            }
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </View>
            <View style={styles.seatInfo}>
              <IconLabel
                icon="radio-button-on-outline"
                color="white"
                title="Available"
                size={20}
              />
              <IconLabel
                icon="radio-button-on-outline"
                color="#585656"
                title="Taken"
                size={20}
              />
              <IconLabel
                icon="radio-button-on-outline"
                color="orange"
                title="Selected"
                size={20}
              />
            </View>
            <Text
              style={{
                color: GlobalColors.validate,
                fontSize: 20,
                fontWeight: "500",
                textAlign: "center",
                marginBottom: 0,
                marginTop: 10,
              }}
            >
              ${route?.params?.price}/seat
            </Text>
            <Text
              style={{
                color: GlobalColors.mainColor2,
                fontSize: 30,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: -30,
                marginTop: 20,
              }}
            >
              Hall: {hallSelected?.auditoriumName}
            </Text>
          </View>
        )}

        <View style={styles.rootPaymentContainer}>
          <View style={styles.rootPayment}>
            <View style={styles.payment}>
              <View style={styles.total}>
                <Text style={styles.totalText}>Total Price</Text>
                <View style={styles.price}>
                  <Text style={styles.priceText}>
                    $ {addDotsToNumber(cost.toFixed(2))}
                  </Text>
                  {/* <Text style={{ color: "white", fontSize: 25 }}> VND</Text> */}
                </View>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.buyTicket,
                  pressed && styles.pressed,
                ]}
                onPress={buyTicketHandler}
              >
                <Text style={styles.buyStyle}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
export default BookSeatScreen;
const styles = StyleSheet.create({
  root: {
    // flex: 1,
    height: "87%",
  },
  container: {
    alignItems: "center",
    gap: 17,
  },
  seatRow: {
    flexDirection: "row",
    gap: 20,
  },
  seatInfo: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  calendar: {
    marginVertical: 5,
    height: 70,
  },
  time: {
    marginTop: 5,
    paddingBottom: 50,
  },
  calendarContainer: {
    width: 50,
    backgroundColor: "#0A0A0A",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 10,
  },
  dateStyle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  dayStyle: {
    color: "white",
    fontSize: 10,
  },
  timeContainer: {
    width: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    marginHorizontal: 10,
  },
  timeStyle: {
    color: "gray",
  },
  payment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  rootPayment: {
    width: "100%",
    backgroundColor: GlobalColors.lightBackground,
    height: 100,
    justifyContent: "center",
  },
  rootPaymentContainer: {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
    bottom: -50,
    height: 40,
  },
  total: {
    justifyContent: "center",
    alignItems: "center",
  },
  totalText: {
    color: "gray",
    fontSize: 14,
  },
  price: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    color: "white",
    fontSize: 25,
  },
  buyStyle: { color: "white", fontWeight: "bold" },
  buyTicket: {
    backgroundColor: "orange",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  pressed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  imageBG: {
    width: "100%",
    aspectRatio: 1272 / 1327,
    borderRadius: 20,
    position: "absolute",
    top: 110,
    opacity: 0.6,
  },
  linearGradient: {
    height: "100%",
    zIndex: 1,
    flex: 1,
  },
  selectList1: {
    borderRadius: 0,
    borderRadius: 10,
    borderWidth: 0.2,
    borderColor: "gray",
    margin: 10,
    textAlign: "center",
  },
});
