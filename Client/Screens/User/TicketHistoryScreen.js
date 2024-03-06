import { View, StyleSheet, FlatList, Text, Alert } from "react-native";
import TicketItem from "../../Components/Tickets/TicketItem";
import { useContext, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import { AuthContext } from "../../Store/authContext";
import EmptyTicket from "../../Components/UI/EmptyTicket";
import { fetchTickets } from "../../Util/firebase";
import { Dimensions } from "react-native";

import GlobalColors from "../../Color/colors";
import { ScrollView } from "react-native";
import FlatButton from "../../Components/UI/FlatButton";
import { TouchableOpacity } from "react-native";
import { Pressable } from "react-native";
import { GetAllBillOfUser } from "../../Util/databaseAPI";
import Loading from "../../Components/UI/Loading";
const dimensions = Dimensions.get("window");
function TicketHistoryScreen({ navigation, route }) {
  const [tickets, setTickets] = useState([]);
  const [bookingInfo, setBookingInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const authCtx = useContext(AuthContext);

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => {
  //       return (
  //         <FlatButton
  //           onPress={() => navigation.navigate("TicketHistoryDetailScreen")}
  //         >
  //           <Text
  //             style={{
  //               color: GlobalColors.button,
  //               fontSize: 15,
  //               fontWeight: "bold",
  //             }}
  //           >
  //             History
  //           </Text>
  //         </FlatButton>
  //       );
  //     },
  //   });
  // }, []);

  useEffect(() => {
    // async function loadTickets() {
    //   const tickets = await fetchTickets("Fr12DTh4yHTj5CDH7YZT6L8Bmn02");
    //   // const tickets = await fetchTickets(authCtx.uid);
    //   setTickets(tickets);
    // }
    // if (isFocused) {
    //   loadTickets();
    // }
    async function getBookingTickets() {
      setIsLoading((curr) => !curr);
      const res = await GetAllBillOfUser(authCtx.idUser, false);
      if (!res || res.length === 0) {
        setIsLoading((curr) => !curr);

        return;
      }
      console.log("tickets: ", res);
      const seatsArray = generateSeat();
      const temp = res?.map((item) => {
        let rowsShorten = new Set();
        let rows = [];
        let seats = [];

        //Food  and Beverage
        let foodBeveragesTemp = [];
        item?.orders?.forEach((order) => {
          if (foodBeveragesTemp.length === 0) {
            let temp = { ...order };
            temp.quantitySelected = 1;
            foodBeveragesTemp.push(temp);
          } else if (getIndexOfFoodAndDrink(foodBeveragesTemp, order) !== -1) {
            foodBeveragesTemp[
              getIndexOfFoodAndDrink(foodBeveragesTemp, order)
            ].quantitySelected += 1;
          } else {
            let temp = { ...order };
            temp.quantitySelected = 1;
            foodBeveragesTemp.push(temp);
          }
        });

        let foodBeverages = foodBeveragesTemp?.map((item) => {
          return {
            id: item?.id,
            image: item?.foodAndDrinks?.imageUrl,
            title: item?.foodAndDrinks?.name,
            detail: item?.foodAndDrinks?.description,
            price: item?.price,
            quantitySelected: item?.quantitySelected,
            servingSize: item?.servingSize,
          };
        });
        //Food  and Beverage

        item?.seats?.forEach((element) => {
          rows.push(element.rowNumber);
          rowsShorten.add(element.rowNumber);
          seats.push(
            seatsArray[element?.rowNumber - 1][element?.colNumber - 1]?.number
          );
        });
        const total = item?.ticketsCost + item?.ordersCost;
        const discountCostTemp = (item?.discount?.percentage * total) / 100;
        const discountCost =
          discountCostTemp > item?.discount?.maximumDiscount
            ? item?.discount?.maximumDiscount
            : discountCostTemp;
        return {
          movieId: item?.movie?.id,
          reservationId: item?.ticketIds,
          movieDetail: {
            poster_path: item?.movie?.posterPath,
            runtime: item?.movie?.runtime,
            title: item?.movie?.originalTitle,
          },
          cinema: {
            id: item?.cinema?.id,
            name: item?.cinema?.name,
            address: item?.cinema?.address,
          },
          date: new Date(item?.showtime?.date),

          time: item?.showtime?.startTime?.slice(
            0,
            item?.showtime?.startTime?.length - 3
          ),
          row: [...rows].join(", "),
          rowsShorten: [...rowsShorten].join(", "),
          seatNumber: seats.join(", "),
          hall: item?.auditorium?.name,
          location: item?.cinema?.address,
          ticketsCost: item?.ticketsCost,
          ordersCost: item?.ordersCost,
          totalCost:
            item?.ticketsCost +
            item?.ordersCost -
            (discountCost ? discountCost : 0),
          discountCost: discountCost ? discountCost : 0,
          foodBeverages: foodBeverages,
        };
      });
      setTickets(
        temp?.sort(
          (ticket1, ticket2) => new Date(ticket1.date) - new Date(ticket2.date)
        )
      );
      setIsLoading((curr) => !curr);
    }
    getBookingTickets();
    // const tickets = [
    //   {
    //     movieId: 1,
    //     reservationId: 1,
    //     movieDetail: {
    //       poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
    //       runtime: 160,
    //       title: "DOCTOR  STRANGE  IN  THE MULTIVERSE  OF  MADNESS (U/A) ",
    //     },
    //     date: new Date(2023, 10, 16, 0, 0, 0, 0),

    //     time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
    //     row: "2",
    //     seatNumber: "03",
    //     hall: 3,
    //     location: "PVR VR Mall, Anna Nagar",
    //   },
    //   {
    //     movieId: 1,
    //     reservationId: 2,
    //     movieDetail: {
    //       poster_path: "/b0Ej6fnXAP8fK75hlyi2jKqdhHz.jpg",
    //       runtime: 200,
    //       title: "DOCTOR  STRANGE  IN  THE MULTIVERSE  OF  MADNESS (U/A) ",
    //     },
    //     date: new Date(2023, 10, 16, 0, 0, 0, 0),
    //     time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
    //     row: "5",
    //     seatNumber: "20",
    //     hall: 3,
    //     location: "PVR VR Mall, Anna Nagar",
    //   },
    //   {
    //     movieId: 2,
    //     reservationId: 3,
    //     movieDetail: {
    //       poster_path: "/kdPMUMJzyYAc4roD52qavX0nLIC.jpg",
    //       runtime: 100,
    //       title: "DOCTOR  STRANGE  IN  THE MULTIVERSE  OF  MADNESS (U/A) ",
    //     },
    //     date: new Date(2023, 9, 16, 0, 0, 0, 0),

    //     time: getTime(new Date(2023, 9, 16, 0, 0, 0, 0)),
    //     row: "7",
    //     seatNumber: "10",
    //     hall: 4,
    //     location: "PVR VR Mall, Anna Nagar",
    //   },
    //   {
    //     movieId: 2,
    //     reservationId: 4,
    //     movieDetail: {
    //       poster_path: "/kdPMUMJzyYAc4roD52qavX0nLIC.jpg",
    //       runtime: 100,
    //       title: "DOCTOR  STRANGE  IN  THE MULTIVERSE  OF  MADNESS (U/A) ",
    //     },
    //     date: new Date(2023, 9, 16, 0, 0, 0, 0),

    //     time: getTime(new Date(2023, 9, 16, 0, 0, 0, 0)),
    //     row: "7",
    //     seatNumber: "10",
    //     hall: 4,
    //     location: "PVR VR Mall, Anna Nagar",
    //   },
    //   {
    //     movieId: 2,
    //     reservationId: 5,
    //     movieDetail: {
    //       poster_path: "/kdPMUMJzyYAc4roD52qavX0nLIC.jpg",
    //       runtime: 100,
    //       title: "DOCTOR  STRANGE  IN  THE MULTIVERSE  OF  MADNESS (U/A) ",
    //     },
    //     date: new Date(),
    //     time: getTime(new Date(2023, 9, 16, 0, 0, 0, 0)),
    //     row: "7",
    //     seatNumber: "10",
    //     hall: 5,
    //     location: "PVR VR Mall, Anna Nagar",
    //   },
    // ];
    // const ticketGroups = [];
    // for (var ticket of tickets) {
    //   if (ticketGroups.length === 0) {
    //     ticketGroups.push(ticket);
    //     continue;
    //   }
    //   const itemExist = ticketGroups.find(
    //     (item) =>
    //       item.movieId === ticket.movieId &&
    //       item.date.getTime() === ticket.date.getTime() &&
    //       item.time === ticket.time &&
    //       item.hall === ticket.hall &&
    //       item.location === ticket.location
    //   );
    //   if (itemExist) {
    //     itemExist.seatNumber += `, ${ticket.seatNumber}`;
    //     itemExist.row += `, ${ticket.row}`;
    //   } else {
    //     ticketGroups.push(ticket);
    //   }
    // }
    // setTickets(ticketGroups);
  }, []);

  function getIndexOfFoodAndDrink(arr, value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.foodAndDrinks?.id === value?.foodAndDrinks?.id) {
        return i;
      }
    }
    return -1;
  }
  function generateSeat() {
    const numberRow = 10;
    let numberColumn = 3;

    let rowArray = [];
    let reach = false;

    let start = 1;
    for (let i = 0; i < numberRow; i++) {
      let columnArray = [];
      for (let j = 0; j < numberColumn; j++) {
        let seatObject = {
          number: start < 10 ? "0" + start : start,
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
  async function loadTickets() {
    // const tickets = await fetchTicket();
    // const tickets = await fetchTickets(authCtx.uid);
    // setTickets(tickets);
  }
  function getTime(rawDate) {
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
  function renderTicketItem(itemData) {
    async function deleteTicketHandler() {
      try {
        // deleteTicketOfUser(authCtx.uid, itemData.item.id);
        // const response = await deleteTicket(itemData.item.id);
        // setTickets((tickets) =>
        //   tickets.filter((tk) => tk.id !== itemData.item.id)
        // );
        // await loadTickets();
      } catch (error) {
        console.log(error);
      }
    }
    function deleteTickets() {
      Alert.alert("Warning", "Are you sure delete", [
        {
          text: "Sure",
          onPress: () => {
            deleteTicketHandler();
          },
        },
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
        },
      ]);
    }
    function convertStringDate(timeString) {
      var [hours, minutes] = timeString.split(":");
      var date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      date.setSeconds(0);
      return date;
    }
    function goToTicketDetailScreen() {
      navigation.navigate("TicketDetailScreen", {
        movieDetail: itemData.item.movieDetail,
        ticketDetail: {
          rows: itemData.item.row,
          hall: itemData.item.hall,
          idTicket: itemData.item.reservationId,
          address: itemData.item.location,
          dateTime: itemData.item.date,
          time: convertStringDate(itemData.item.time),
          // time: (itemData.item.time),
          seats: itemData.item.seatNumber,
          ordersCost: itemData.item.ordersCost,
          ticketsCost: itemData.item.ticketsCost,
          totalCost: itemData.item.totalCost,
          discountCost: itemData.item.discountCost,
          foodBeverage: itemData.item.foodBeverages,
        },
      });
    }

    return (
      <Pressable
        style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.7 }]}
        onPress={goToTicketDetailScreen}
      >
        <View style={{ height: 620 }}>
          <TicketItem
            posterImage={itemData.item.movieDetail.poster_path}
            dateTime={itemData.item.date}
            time={itemData.item.time}
            seats={itemData.item.seatNumber}
            row={itemData.item.rowsShorten}
            hall={itemData.item.hall}
            idTicket={itemData.item.reservationId}
            address={itemData.item.location}
            onDelete={deleteTickets}
            isDisable
            isNoBarCode
          />
        </View>

        {/* <View
          style={{
            width: "78%",
            backgroundColor: GlobalColors.mainColor3,
            height: 140,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            zIndex: 1,
            marginTop: -30,
          }}
        /> */}
      </Pressable>
    );
  }
  return (
    <>
      {isLoading && (
        <View style={{ flex: 1 }}>
          <Loading />
        </View>
      )}
      {!isLoading && (
        <View style={{ flex: 1 }}>
          <View style={styles.root}>
            <Text style={styles.title}>
              Once you buy a movie ticket simply scan the barcode to acces to
              your movie.
            </Text>
            <View style={styles.subRoot}>
              {tickets.length > 0 ? (
                <FlatList
                  horizontal
                  keyExtractor={(item, index) => index}
                  data={tickets}
                  renderItem={renderTicketItem}
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: "100%",
                        width: 5,
                      }}
                    />
                  )}
                  pagingEnabled
                  style={{ width: dimensions.width + 5, height: "100%" }}
                />
              ) : (
                <EmptyTicket />
              )}
            </View>
            {/* <View
        style={{
          width: "77%",
          backgroundColor: "#FF5524",
          height: 20,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          zIndex: 1,
          marginTop: -116,
        }}
      />
      <View
        style={{
          width: "78%",
          backgroundColor: GlobalColors.mainColor3,
          marginTop: -10,

          height: 150,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        }}
      /> */}
          </View>
        </View>
      )}
    </>
  );
}

export default TicketHistoryScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
  },
  subRoot: {
    height: "86%",
    marginTop: -80,
  },
  title: {
    color: GlobalColors.mainColor1,
    height: 100,
    fontSize: 17,
    maxWidth: 260,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "500",
  },
});
