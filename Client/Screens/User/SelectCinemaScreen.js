import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableHighlight,
  Alert,
  Modal,
  Pressable,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BookSeatScreen from "./BookSeatScreen";
import { LinearGradient } from "expo-linear-gradient";
import IconButton from "../../Components/UI/IconButton";
import GlobalColors from "../../Color/colors";
import { AirbnbRating } from "react-native-ratings";
import { useContext, useEffect, useState } from "react";
import NoSchedule from "../../Components/UI/NoSchedule";
import { GetMovieScheduleById } from "../../Util/databaseAPI";
import { BookingContext } from "../../Store/bookingContext";
import Loading from "../../Components/UI/Loading";
function SelectCinemaScreen({ navigation, route }) {
  const [calendar, setCalendar] = useState(generateCalendar());
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeIndexList, setSelectedTimeIndexList] = useState([]);
  const [isDropDownList, setIsDropDownList] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const bookingCtx = useContext(BookingContext);
  const [isLoading, setIsLoading] = useState(false);
  const timeArray = [
    "08:00",
    "10:00",
    "12:00",
    "13:30",
    "14:30",
    "16:00",
    "18:00",
    "20:00",
  ];

  // const cinemas = [
  //   {
  //     id: 1,
  //     name: "Cinema 1",
  //     seats: 30,
  //     address: "Dai hoc quoc gia",
  //     times: timeArray,
  //     freeHalls: [
  //       [1, 2, 3, 4, 5],
  //       [9, 2, 3, 4, 5],
  //       [1, 2, 3, 4, 5],
  //       [1, 2, 3, 4, 5],
  //       [1, 2, 3, 4, 5],
  //       [1, 2, 3, 4, 5],
  //       [1, 2, 3, 4, 5],
  //       [1, 2, 3, 4, 5],
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Cinema 2",
  //     seats: 30,
  //     address: "Dai hoc quoc gia",
  //     times: timeArray,
  //     freeHalls: [
  //       [1, 4, 5],
  //       [1, 4, 5],
  //       [1, 4, 5],
  //       [1, 4, 5],
  //       [1, 4, 5],
  //       [1, 4, 5],
  //       [1, 4, 5],
  //       [1, 4, 5],
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: "Cinema 3",
  //     seats: 30,
  //     address: "Dai hoc quoc gia",
  //     times: timeArray,
  //     freeHalls: [
  //       [3, 4, 5],
  //       [3, 4, 5],
  //       [3, 4, 5],
  //       [3, 4, 5],
  //       [3, 4, 5],
  //       [3, 4, 5],
  //       [3, 4, 5],
  //       [3, 4, 5],
  //     ],
  //   },
  // ];
  useEffect(() => {
    async function GetMovieSchedule(movieId) {
      setIsLoading((curr) => !curr);
      const res = await GetMovieScheduleById(movieId);
      console.log(res);
      if (!res) {
        return;
      }
      const schedules = [];
      res?.forEach((item, index) => {
        let schedule = [];
        item?.cinemas?.forEach((cinema) => {
          let scheduleMv = {
            id: cinema.id,
            name: cinema.name,
            seats: 30,
            address: cinema.address,
          };
          let scheduleMap = new Map();
          // const times = cinema?.showtimes?.map((time)=>time.startTime);
          // scheduleMv.times=[...times];
          cinema?.showtimes.forEach((item1) => {
            if (!scheduleMap.has(removeTwoNumberAtEndTime(item1.startTime))) {
              scheduleMap.set(removeTwoNumberAtEndTime(item1.startTime), [
                {
                  auditoriumName: item1?.auditorium?.name,
                  showtimeId: item1?.id,
                },
              ]);
            } else {
              const oldArray = [
                ...scheduleMap.get(removeTwoNumberAtEndTime(item1.startTime)),
              ];
              scheduleMap.set(removeTwoNumberAtEndTime(item1.startTime), [
                ...oldArray,
                {
                  auditoriumName: item1?.auditorium?.name,
                  showtimeId: item1?.id,
                },
              ]);
            }
          });
          scheduleMv.times = [...scheduleMap.keys()];
          scheduleMv.freeHalls = [...scheduleMap.values()];

          schedule.push(scheduleMv);
        });
        schedules.push(schedule);
        // return {
        //   id: item.,
        // name: "Cinema 3",
        // seats: 30,
        // address: "Dai hoc quoc gia",
        // times: timeArray,
        // freeHalls: [
        //   [3, 4, 5],
        //   [3, 4, 5],
        //   [3, 4, 5],
        //   [3, 4, 5],
        //   [3, 4, 5],
        //   [3, 4, 5],
        //   [3, 4, 5],
        //   [3, 4, 5],
        // ]
        // }
      });
      setSchedules(schedules);
      setSelectedDateIndex(0);
      setCinemas(schedules[0]?.filter((item) => item?.times?.length !== 0));
      setIsLoading((curr) => !curr);
    }
    console.log("movieId", route?.params?.movieId);
    GetMovieSchedule(route?.params?.movieId);
  }, []);
  function removeTwoNumberAtEndTime(time) {
    return time.slice(0, time?.length - 3);
  }
  function generateCalendar() {
    let date = new Date(Date.now());
    const weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      let template = {
        date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
        day: weekDay[
          new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()
        ],
        month:
          new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getMonth() + 1,
        year: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getFullYear(),
      };
      weekDays.push(template);
    }
    return weekDays;
  }

  function selectTimeHandler(cinemasIndex, timeIndex) {
    // console.log("cinemas", cinemas[cinemasIndex]);
    // console.log(
    //   "time",
    //   cinemas[cinemasIndex].freeHalls[timeIndex][0].showtimeId
    // );
    bookingCtx.setBookingInfo({
      showtimeId: cinemas[cinemasIndex].freeHalls[timeIndex][0].showtimeId,
      cinemaId: cinemas[cinemasIndex].id,
    });
    navigation.navigate("BookSeatScreen", {
      movieId: route.params.movieId,
      backdrop_path: route.params.backdrop_path,
      times: cinemas[cinemasIndex].times,
      price: route.params.movieDetail.price,
      timeSelected: cinemas[cinemasIndex].times[timeIndex],
      date: calendar[selectedDateIndex],
      movieDetail: route.params.movieDetail,
      cinemas: cinemas[cinemasIndex],
    });
  }
  function isTimeGreaterThanNow(timeString) {
    //current date
    const date = calendar[selectedDateIndex];
    if (date.date > new Date().getDate()) {
      return true;
    }

    if (parseInt(date.year) > new Date().getFullYear()) {
      return true;
    }
    // Get the current time
    var now = new Date();

    // Create a string representing the time you want to compare (format: "HH:MM:SS")

    // Split the time string into hours, minutes, and seconds
    var timeParts = timeString.split(":");
    var hours = parseInt(timeParts[0], 10);
    var minutes = parseInt(timeParts[1], 10);

    // Create a new Date object with the same date as the current time, but with the parsed hours, minutes, and seconds
    var compareTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    // console.log("compareTime: " + compareTime);
    // console.log("now:", now);
    // console.log(now <= compareTime);
    // Compare the two date objects
    if (now <= compareTime) {
      return true;
    } else {
      return false;
    }
  }
  function CinemaItem(itemData) {
    return (
      <View style={{ width: "100%", gap: 10, marginBottom: 10 }}>
        <View
          style={{
            borderRadius: 10,
            backgroundColor: GlobalColors.mainColor1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 15, color: "black", fontWeight: "600" }}>
            {itemData.item.name}
          </Text>
          {isDropDownList[itemData.index] && (
            <IconButton
              icon={"caret-down"}
              size={24}
              color="white"
              onPress={() => {
                isDropDownList[itemData.index] =
                  !isDropDownList[itemData.index];
                setIsDropDownList((curr) => [...curr]);
              }}
            />
          )}
          {!isDropDownList[itemData.index] && (
            <IconButton
              icon={"caret-up"}
              size={24}
              color="white"
              onPress={() => {
                isDropDownList[itemData.index] =
                  !isDropDownList[itemData.index];
                setIsDropDownList((curr) => [...curr]);
              }}
            />
          )}
        </View>
        <Text style={{ fontSize: 15, color: "white", marginLeft: 10 }}>
          Address: {itemData.item?.address}
        </Text>
        {isDropDownList[itemData.index] && (
          <View style={styles.time}>
            <FlatList
              horizontal
              data={itemData.item.times}
              initialScrollIndex={selectedTimeIndexList[itemData.index]}
              showsHorizontalScrollIndicator={false}
              renderItem={(subItemData) => {
                return (
                  <TouchableOpacity
                    disabled={!isTimeGreaterThanNow(subItemData.item)}
                    style={[
                      styles.timeContainer,
                      !isTimeGreaterThanNow(subItemData.item) && {
                        opacity: 0.5,
                      },
                      // selectedTimeIndexLists[itemData.index] === subItemData.index
                      //   ? { backgroundColor: "#f44ee6a1" }
                      //   : null,
                    ]}
                    onPress={() => {
                      selectTimeHandler(itemData.index, subItemData.index);
                      //   selectedTimeIndexLists[itemData.index] =
                      //     subItemData.index;
                      //   setSelectedTimeIndexList((curr) => [...curr]);
                    }}
                  >
                    <Text style={styles.timeStyle}>{subItemData.item}</Text>
                    <Text style={styles.timeThinStyle}>
                      {parseInt(subItemData.item.slice(0, 2)) < 12
                        ? "AM"
                        : "PM"}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  }

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={styles.header}>
            <IconButton
              icon={"chevron-back-outline"}
              color={"white"}
              size={30}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.bookCenteredView}>
            <View style={styles.background}>
              <ImageBackground
                defaultSource={require("../../../icon/defaultmovie.png")}
                source={{
                  uri:
                    "https://image.tmdb.org/t/p/w500" +
                    route.params?.backdrop_path,
                }}
                imageStyle={{ borderRadius: 0 }}
                style={styles.imageBG}
              ></ImageBackground>
              <LinearGradient
                colors={["#24204b40", "#08031df3"]}
                style={styles.linearGradient}
              ></LinearGradient>
            </View>

            <View style={styles.action}>
              <View style={styles.body}>
                <Text style={styles.title}>{route.params?.title}</Text>
                <AirbnbRating
                  ratingCount={5}
                  size={20}
                  showRating={false}
                  isDisabled
                  //   onFinishRating={(value) => setRatingValue(value)}
                  defaultRating={parseInt(route.params?.vote_average)}
                />
                <Text style={styles.language}>
                  {route.params?.movieDetail?.spoken_languages[0]?.english_name}
                </Text>
                <Text style={styles.language}>
                  Director: {route.params?.director?.name}
                </Text>
                <Text style={styles.overview} numberOfLines={4}>
                  {route.params.overview}
                </Text>
                <Text style={{ color: "white", fontSize: 20, marginTop: 20 }}>
                  Selected date and time
                </Text>
                <View style={styles.calendar}>
                  <FlatList
                    horizontal
                    data={calendar}
                    initialScrollIndex={selectedDateIndex}
                    showsHorizontalScrollIndicator={false}
                    renderItem={(itemData) => {
                      return (
                        <TouchableOpacity
                          style={[
                            styles.calendarContainer,
                            selectedDateIndex === itemData.index
                              ? { backgroundColor: "#f44ee6a1" }
                              : null,
                          ]}
                          onPress={() => {
                            setSelectedDateIndex(itemData.index);
                            setCinemas(
                              schedules[itemData.index]?.filter(
                                (item) => item?.times?.length !== 0
                              )
                            );
                          }}
                        >
                          <Text style={styles.dateStyle}>
                            {itemData.item.day}
                          </Text>
                          <Text style={styles.dayStyle}>
                            {itemData.item.date}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
                <View style={{ marginBottom: 180, marginTop: 10 }}>
                  {cinemas?.length == 0 && <NoSchedule />}
                  {cinemas?.length !== 0 && (
                    <FlatList
                      data={cinemas}
                      keyExtractor={(item) => item.id}
                      renderItem={(itemData) =>
                        CinemaItem(itemData, selectedTimeIndexList)
                      }
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
export default SelectCinemaScreen;
const styles = StyleSheet.create({
  bookCenteredView: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  background: {
    borderRadius: 20,
    position: "absolute",
    height: "100%",
    zIndex: -1,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 2,
  },
  imageBG: {
    width: "100%",
    aspectRatio: 1072 / 1527,
    borderRadius: 20,
  },
  linearGradient: {
    height: "100%",
    marginTop: -50,
    zIndex: 1,
    flex: 1,
  },
  action: {
    marginTop: 395,
    alignSelf: "center",
    padding: 10,
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    position: "absolute",
    top: 30,
    left: 5,
    zIndex: 1,
  },
  body: {
    height: "100%",
    justifyContent: "center",
    gap: 5,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    maxWidth: 320,
    alignSelf: "center",
  },
  language: {
    fontSize: 13,
    color: "white",
    textAlign: "center",
  },
  overview: {
    fontSize: 15,
    color: "white",
    marginRight: 5,
    fontWeight: "500",
    textAlign: "justify",
    maxWidth: 300,
  },

  calendar: {
    marginVertical: 5,
    height: 70,
  },
  time: {
    marginTop: 5,
    // paddingBottom: 50,
    // height: 90,
    marginBottom: 15,
  },
  calendarContainer: {
    width: 50,
    backgroundColor: "#271C51",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginHorizontal: 10,
    borderColor: GlobalColors.mainColor2,
    borderWidth: 1,
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
    width: 80,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: GlobalColors.mainColor2,
    borderWidth: 1,
    padding: 5,
    marginHorizontal: 10,
    backgroundColor: "#271C51",
  },
  timeStyle: {
    color: "white",
    fontWeight: "bold",
  },
  timeThinStyle: {
    color: "white",
    fontSize: 10,
  },
});
