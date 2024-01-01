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
import {
  GetMovieScheduleByCinemaId,
  GetMovieScheduleById,
} from "../../Util/databaseAPI";
import { BookingContext } from "../../Store/bookingContext";
import Loading from "../../Components/UI/Loading";
import IconLabel from "../../Components/UI/IconLabel";
import LoadingImage from "../../Components/UI/LoadingImage";
function MovieScheduleOfCinemaScreen({ navigation, route }) {
  const [calendar, setCalendar] = useState(generateCalendar());
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTimeIndexList, setSelectedTimeIndexList] = useState([]);
  const [isDropDownList, setIsDropDownList] = useState([]);
  const [movies, setMovies] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const bookingCtx = useContext(BookingContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoviesLoading, setIsMoviesLoading] = useState(false);
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
    async function GetMovieSchedule(cinemaId) {
      setIsLoading((curr) => !curr);
      const res = await GetMovieScheduleByCinemaId(cinemaId);
      console.log(res);
      if (!res) {
        return;
      }
      const schedules = [];
      res?.forEach((item, index) => {
        let schedule = [];
        item?.movies?.forEach((movie) => {
          let categories = JSON.parse(movie?.genres).reduce(
            (accumulator, currentValue, index) => {
              return accumulator + currentValue?.name + ", ";
            },
            ""
          );
          let scheduleMv = {
            id: movie?.id,
            title: movie?.title,
            categories: categories.slice(0, categories.length - 2),
            seats: 30,
            originalLanguage: movie?.originalLanguage,
            backdrop_path: movie?.backdropPath,
            poster_path: movie?.posterPath,
            vote_average: movie?.voteAverage,
            release_date: movie?.releaseDate,
            runtime: movie?.runtime,
          };
          let scheduleMap = new Map();
          // const times = cinema?.showtimes?.map((time)=>time.startTime);
          // scheduleMv.times=[...times];
          movie?.showtimes.forEach((item1) => {
            if (item1?.status !== "available") {
              return;
            }
            if (!scheduleMap.has(removeTwoNumberAtEndTime(item1.startTime))) {
              scheduleMap.set(removeTwoNumberAtEndTime(item1.startTime), [
                {
                  auditoriumName: item1?.auditorium?.name,
                  showtimeId: item1?.id,
                  price: item1?.price,
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
                  price: item1?.price,
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

      console.log(JSON.stringify(schedules));
      setSchedules(schedules);
      setSelectedDateIndex(0);
      setMovies(schedules[0]?.filter((item) => item?.times?.length !== 0));
      setIsLoading((curr) => !curr);
    }
    GetMovieSchedule(route?.params?.cinemaId);
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
        month:
          new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getMonth() + 1,
        day: weekDay[
          new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()
        ],
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
      showtimeId: movies[cinemasIndex].freeHalls[timeIndex][0].showtimeId,
      cinemaId: route?.params?.cinemaId,
    });
    let temp = movies[cinemasIndex];
    temp.address = route?.params?.cinemaAddress;
    bookingCtx.setCurrentMovie(movies[cinemasIndex]);
    navigation.navigate("BookSeatScreen", {
      movieId: movies[cinemasIndex].id,
      backdrop_path: movies[cinemasIndex].backdrop_path,
      times: movies[cinemasIndex].times,
      price: movies[cinemasIndex].freeHalls[timeIndex][0].price,
      timeSelected: movies[cinemasIndex].times[timeIndex],
      date: calendar[selectedDateIndex],
      movieDetail: movies[cinemasIndex],
      cinemas: temp,
    });
  }
  function isTimeGreaterThanNow(timeString) {
    //current date
    const date = calendar[selectedDateIndex];
    // console.log("selected date", date);
    if (parseInt(date.date) > new Date().getDate()) {
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
    console.log("compareTime: " + compareTime);
    console.log("now:", now);
    console.log(now <= compareTime);
    // Compare the two date objects
    if (now <= compareTime) {
      return true;
    } else {
      return false;
    }
  }
  function CinemaItem(itemData) {
    return (
      <View
        style={{
          width: "100%",
          gap: 10,
          marginBottom: 10,
          alignItems: "flex-start",
          backgroundColor: GlobalColors.lightBackground,
          borderRadius: 10,
        }}
      >
        <View style={styles.item}>
          <Image
            defaultSource={require("../../../icon/defaultmovie.png")}
            style={styles.image1}
            source={{
              uri:
                "https://image.tmdb.org/t/p/w500" + itemData.item?.poster_path,
            }}
          />

          <View style={styles.container}>
            <Text style={styles.title1} numberOfLines={2}>
              {itemData.item?.title}{" "}
            </Text>
            <IconLabel
              icon="ios-star-outline"
              size={20}
              color={"orange"}
              title={itemData.item?.vote_average?.toFixed(1)}
            />
            <View
              style={{
                maxWidth: 200,
              }}
            >
              <IconLabel
                icon="md-pricetags-outline"
                size={20}
                color={"white"}
                title={itemData.item?.categories}
              />
            </View>

            <IconLabel
              icon="calendar-outline"
              size={20}
              color={"white"}
              title={itemData.item?.release_date}
            />
            <IconLabel
              icon="time-outline"
              size={20}
              color={"white"}
              title={itemData.item?.runtime + " minutes"}
            />
          </View>
        </View>
        {/* ////// */}
        <FlatList
          style={[styles.time]}
          keyExtractor={(item, index) => index}
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
                  {parseInt(subItemData.item.slice(0, 2)) < 12 ? "AM" : "PM"}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <View style={{ flex: 1 }}>
          <Pressable
            style={[styles.header, { flexDirection: "row" }]}
            onPress={() => navigation.goBack()}
          >
            <IconButton
              icon={"chevron-back-outline"}
              color={"white"}
              size={30}
              onPress={() => navigation.goBack()}
            />
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {route?.params?.cinemaName}
            </Text>
          </Pressable>
          <View style={styles.bookCenteredView}>
            <View style={styles.body}>
              {/* <Text style={{ color: "white", fontSize: 20, marginTop: 20 }}>
                  Selected date and time
                </Text> */}
              <View style={styles.calendar}>
                <FlatList
                  horizontal
                  data={calendar}
                  initialScrollIndex={selectedDateIndex}
                  showsHorizontalScrollIndicator={false}
                  renderItem={(itemData) => {
                    const month = new Date().getMonth() + 1;

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
                          setMovies(
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
                          {itemData.item.date + "/" + itemData.item.month}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
              <View style={{ marginBottom: 200, marginTop: 10 }}>
                {movies?.length == 0 && <NoSchedule />}
                {movies?.length !== 0 && (
                  <FlatList
                    style={{
                      marginBottom: 100,
                    }}
                    data={movies}
                    keyExtractor={(item, index) => index}
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
      )}
    </>
  );
}
export default MovieScheduleOfCinemaScreen;
const styles = StyleSheet.create({
  bookCenteredView: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  action: {
    alignSelf: "center",
    padding: 10,
  },
  header: {
    width: "100%",
    alignItems: "center",
    // top: 30,
    // left: 5,
    // zIndex: 1,
    marginTop: 40,
    marginBottom: 10,
  },
  body: {
    marginTop: 30,
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
    // height: 50,
  },
  timeStyle: {
    color: "white",
    fontWeight: "bold",
  },
  timeThinStyle: {
    color: "white",
    fontSize: 10,
  },

  item: {
    flexDirection: "row",
    padding: 7,
  },
  image1: {
    width: 110,
    height: 180,
    borderRadius: 15,
    marginEnd: 10,
    borderColor: "white",
    borderWidth: 1,
  },
  container: {
    alignItems: "flex-start",
    width: 220,
  },
  title1: {
    color: "white",
    fontSize: 20.5,
    marginLeft: 5,
    marginTop: 5,
  },
  pressed: {
    opacity: 0.5,
  },
});
