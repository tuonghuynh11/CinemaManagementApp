import { View, StyleSheet, SafeAreaView } from "react-native";
import IconButton from "../../Components/UI/IconButton";
import { Text } from "react-native";
import { SectionList } from "react-native";
import { getDate, getTime, convertStringDate } from "../../Helper/DateTime";
import HistoryTicketItem from "../../Components/Tickets/HistoryTicketItem";
import { Ionicons } from "@expo/vector-icons";
import GlobalColors from ".././../Color/colors";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Store/authContext";
import { GetAllBillOfUser } from "../../Util/databaseAPI";
import Loading from "../../Components/UI/Loading";
import EmptyTicket from "../../Components/UI/EmptyTicket";
function TicketHistoryDetailScreen({ navigation, route }) {
  // const historyTicket = [
  //   {
  //     title: new Date(2023, 11, 12),
  //     data: [
  //       {
  //         reservationIds: [5, 6],
  //         movieDetail: {
  //           poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  //           id: 12,
  //           poster: "/7WfK17BXE6szXlm4WOxfswgbdsL.jpg",
  //           title: "DOCTOR STRANGE IN THE MULTIVERSE OF MADNESS",
  //           runtime: 120,
  //           category: "Action, Science",
  //         },
  //         price: 10000,
  //         // movieId: 1,
  //         // reservationId: 1,

  //         date: new Date(2023, 10, 16, 0, 0, 0, 0),

  //         time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
  //         row: "2",
  //         seatNumber: "03",
  //         hall: 3,
  //         location: "PVR VR Mall, Anna Nagar",
  //       },
  //       {
  //         reservationIds: [5, 6],
  //         movieDetail: {
  //           poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  //           id: 12,
  //           poster: "/7WfK17BXE6szXlm4WOxfswgbdsL.jpg",
  //           title: "DOCTOR STRANGE IN THE MULTIVERSE OF MADNESS",
  //           runtime: 120,
  //           category: "Action, Science",
  //         },
  //         price: 10000,
  //         // movieId: 1,
  //         // reservationId: 1,

  //         date: new Date(2023, 10, 16, 0, 0, 0, 0),

  //         time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
  //         row: "2",
  //         seatNumber: "03",
  //         hall: 3,
  //         location: "PVR VR Mall, Anna Nagar",
  //       },
  //       {
  //         reservationIds: [5, 6],
  //         movieDetail: {
  //           poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  //           id: 12,
  //           poster: "/7WfK17BXE6szXlm4WOxfswgbdsL.jpg",
  //           title: "DOCTOR STRANGE IN THE MULTIVERSE OF MADNESS",
  //           runtime: 120,
  //           category: "Action, Science",
  //         },
  //         price: 10000,
  //         // movieId: 1,
  //         // reservationId: 1,

  //         date: new Date(2023, 10, 16, 0, 0, 0, 0),

  //         time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
  //         row: "2",
  //         seatNumber: "03",
  //         hall: 3,
  //         location: "PVR VR Mall, Anna Nagar",
  //       },
  //       {
  //         reservationIds: [5, 6],
  //         movieDetail: {
  //           poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  //           id: 12,
  //           poster: "/7WfK17BXE6szXlm4WOxfswgbdsL.jpg",
  //           title: "DOCTOR STRANGE IN THE MULTIVERSE OF MADNESS",
  //           runtime: 120,
  //           category: "Action, Science",
  //         },
  //         price: 10000,
  //         // movieId: 1,
  //         // reservationId: 1,

  //         date: new Date(2023, 10, 16, 0, 0, 0, 0),

  //         time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
  //         row: "2",
  //         seatNumber: "03",
  //         hall: 3,
  //         location: "PVR VR Mall, Anna Nagar",
  //       },
  //     ],
  //   },
  //   {
  //     title: new Date(2022, 9, 12),
  //     data: [
  //       {
  //         reservationIds: [7, 8],
  //         movieDetail: {
  //           poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  //           id: 12,
  //           poster: "/iiXliCeykkzmJ0Eg9RYJ7F2CWSz.jpg",
  //           title: "Retribution",
  //           runtime: 120,
  //           category: "Science",
  //         },
  //         // movieId: 1,
  //         // reservationId: 1,

  //         date: new Date(2023, 10, 16, 0, 0, 0, 0),

  //         time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
  //         row: "2",
  //         seatNumber: "03",
  //         hall: 3,
  //         location: "PVR VR Mall, Anna Nagar",

  //         price: 20000,
  //       },
  //       {
  //         reservationIds: [7, 8],
  //         movieDetail: {
  //           poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  //           id: 12,
  //           poster: "/iiXliCeykkzmJ0Eg9RYJ7F2CWSz.jpg",
  //           title: "Retribution",
  //           runtime: 120,
  //           category: "Science",
  //         },
  //         // movieId: 1,
  //         // reservationId: 1,

  //         date: new Date(2023, 10, 16, 0, 0, 0, 0),

  //         time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
  //         row: "2",
  //         seatNumber: "03",
  //         hall: 3,
  //         location: "PVR VR Mall, Anna Nagar",

  //         price: 20000,
  //       },
  //       {
  //         reservationIds: [7, 8],
  //         movieDetail: {
  //           poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  //           id: 12,
  //           poster: "/iiXliCeykkzmJ0Eg9RYJ7F2CWSz.jpg",
  //           title: "Retribution",
  //           runtime: 120,
  //           category: "Science",
  //         },
  //         // movieId: 1,
  //         // reservationId: 1,

  //         date: new Date(2023, 10, 16, 0, 0, 0, 0),

  //         time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
  //         row: "2",
  //         seatNumber: "03",
  //         hall: 3,
  //         location: "PVR VR Mall, Anna Nagar",

  //         price: 20000,
  //       },
  //       {
  //         reservationIds: [7, 8],
  //         movieDetail: {
  //           poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg",
  //           id: 12,
  //           poster: "/iiXliCeykkzmJ0Eg9RYJ7F2CWSz.jpg",
  //           title: "Retribution",
  //           runtime: 120,
  //           category: "Science",
  //         },
  //         // movieId: 1,
  //         // reservationId: 1,

  //         date: new Date(2023, 10, 16, 0, 0, 0, 0),

  //         time: getTime(new Date(2023, 10, 16, 0, 0, 0, 0)),
  //         row: "2",
  //         seatNumber: "03",
  //         hall: 3,
  //         location: "PVR VR Mall, Anna Nagar",

  //         price: 20000,
  //       },
  //     ],
  //   },
  // ];
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [historyTicket, setHistoryTicket] = useState([]);

  useEffect(() => {
    async function getBookingTickets() {
      setIsLoading((curr) => !curr);
      const res = await GetAllBillOfUser(authCtx.idUser, true);
      if (!res || res.length === 0) {
        setIsLoading((curr) => !curr);

        return;
      }
      console.log("tickets: ", res);
      const seatsArray = generateSeat();
      let temp = res?.map((item) => {
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
        let categories = JSON.parse(item?.movie?.genres).reduce(
          (accumulator, currentValue, index) => {
            return accumulator + currentValue?.name + ", ";
          },
          ""
        );
        return {
          movieId: item?.movie?.id,
          reservationId: item?.ticketIds,
          movieDetail: {
            poster_path: item?.movie?.posterPath,
            runtime: item?.movie?.runtime,
            title: item?.movie?.originalTitle,
            category: categories.slice(0, categories.length - 2),
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

      temp = temp?.sort(
        (ticket1, ticket2) => new Date(ticket2.date) - new Date(ticket1.date)
      );
      let group = [];
      temp?.forEach((item) => {
        if (group.length === 0) {
          group.push({
            title: item.date.getFullYear(),
            data: [item],
          });
        } else if (getIndexOfGroupTicket(group, item) !== -1) {
          group[getIndexOfGroupTicket(group, item)].data.push(item);
        } else {
          group.push({
            title: item.date.getFullYear(),
            data: [item],
          });
        }
      });

      setHistoryTicket(group);
      setIsLoading((curr) => !curr);
    }
    getBookingTickets();
  }, []);
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
  function getIndexOfGroupTicket(arr, value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.title === value.date.getFullYear()) {
        return i;
      }
    }
    return -1;
  }
  function getIndexOfFoodAndDrink(arr, value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]?.foodAndDrinks?.id === value?.foodAndDrinks?.id) {
        return i;
      }
    }
    return -1;
  }
  function renderPreviousTickets(item) {
    return (
      <HistoryTicketItem
        image={item.movieDetail.poster_path}
        title={item.movieDetail.title}
        runtime={item.movieDetail.runtime}
        category={item.movieDetail.category}
        price={item.totalCost}
        onPress={() => {
          //Move to ticket detail screen
          navigation.navigate("TicketDetailScreen", {
            movieDetail: item.movieDetail,
            ticketDetail: {
              rows: item.row,
              hall: item.hall,
              idTicket: item.reservationId,
              address: item.location,
              dateTime: item.date,
              time: convertStringDate(item.time),
              // time: (item.time),
              seats: item.seatNumber,
              ordersCost: item.ordersCost,
              ticketsCost: item.ticketsCost,
              totalCost: item.totalCost,
              discountCost: item.discountCost,
              foodBeverage: item.foodBeverages,
            },
          });
        }}
      />
    );
  }
  function renderHeaderPreviousTickets(title) {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          backgroundColor: GlobalColors.validate,
          borderRadius: 10,
          padding: 5,
          width: 100,
          marginVertical: 10,
        }}
      >
        <Ionicons name="time-outline" size={24} color="white" />
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }
  return (
    <>
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
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
          Booked History
        </Text>
        {isLoading && (
          <View style={{ flex: 1 }}>
            <Loading />
          </View>
        )}
        {!isLoading && historyTicket.length !== 0 && (
          <View style={{ flex: 1, height: "100%", margin: 10 }}>
            <SectionList
              style={{ height: "49%" }}
              stickySectionHeadersEnabled={true}
              sections={historyTicket}
              keyExtractor={(item, index) => item + index}
              renderItem={({ item }) => renderPreviousTickets(item)}
              renderSectionHeader={({ section: { title } }) =>
                renderHeaderPreviousTickets(title)
              }
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {!isLoading && historyTicket.length === 0 && <EmptyTicket />}
      </SafeAreaView>
    </>
  );
}
export default TicketHistoryDetailScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    alignSelf: "flex-start",
    zIndex: 1,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
