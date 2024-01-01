import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState } from "react";
import TimeOutBooking from "../Components/UI/TImeOutBooking";
import { Alert, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./authContext";

export const BookingContext = createContext({
  timeout: 0,
  resetTimeout: () => {},
  IsTimeout: (timeout) => {},
  runTimeout: (time) => {},
  stopTimeout: () => {},
  startTimeout: () => {},
  isTimeout: false,
  currentMovie: {},
  clearMovie: () => {},
  setCurrentMovie: (value) => {},
  bookingInfo: {},
  bookingInfoTemp: {},
  setBookingInfoTemp: (value) => {},
  clearBookingInfoTemp: () => {},
  setBookingInfo: (value) => {},
  clearBookingInfo: () => {},
});

function BookingContextProvider({ children }) {
  const [timeout, setTimeout] = useState(300);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isDeleteTimer, setIsDeleteTimer] = useState(false);
  const [currentMovie, setCurrentMovies] = useState(null);
  const [bookingInfo, setBookingInfos] = useState({});
  const [bookingInfoTemp, setBookingInfosTemp] = useState({});
  const navigation = useNavigation();
  function IsTimeout(timeout) {
    setIsTimeout(timeout);
  }
  function resetTimeout() {
    setTimeout(300);
  }
  function runTimeout(time) {
    if (timeout < 0) return;
    setTimeout((curr) => curr - 1);
  }
  function stopTimeout() {
    setIsDeleteTimer(true);
    IsTimeout(false);
  }
  function startTimeout() {
    setIsDeleteTimer(false);
  }
  function clearMovie() {
    setCurrentMovies(null);
  }
  function setCurrentMovie(Movie) {
    setCurrentMovies(Movie);
  }

  function setBookingInfo(bookingInfo) {
    setBookingInfos(bookingInfo);
  }

  function clearBookingInfo() {
    setBookingInfos({});
  }
  function setBookingInfoTemp(bookingInfoTemp) {
    setBookingInfosTemp(bookingInfoTemp);
  }
  function clearBookingInfoTemp() {
    setBookingInfosTemp({});
  }
  const value = {
    timeout: timeout,
    isTimeout: isTimeout,
    bookingInfo: bookingInfo,
    bookingInfoTemp: bookingInfoTemp,
    setBookingInfoTemp: setBookingInfoTemp,
    clearBookingInfoTemp: clearBookingInfoTemp,
    setBookingInfo: setBookingInfo,
    clearBookingInfo: clearBookingInfo,
    resetTimeout: resetTimeout,
    runTimeout: runTimeout,
    IsTimeout: IsTimeout,
    stopTimeout: stopTimeout,
    startTimeout: startTimeout,
    clearMovie: clearMovie,
    setCurrentMovie: setCurrentMovie,
    currentMovie: currentMovie,
  };
  async function onTimeChange(value) {
    if (value === 0) {
      //CancelBooking
      //   let cancelBody = { reservations: bookingInfoTemp?.reservations };
      //   if (bookingInfoTemp?.reservationsRoundTrip) {
      //     cancelBody.reservationsRoundTrip =
      //       bookingInfoTemp?.reservationsRoundTrip;
      //   }
      //   const authCtx = useContext(AuthContext);
      //   const res = await cancelBookingSession(authCtx.token, cancelBody);
      //   console.log("Cancel Booking Response code", res);
      //CancelBooking
      clearBookingInfo();
      clearBookingInfoTemp();

      Alert.alert("Warning", "Booking time is overdue!!");
      setIsDeleteTimer(true);
      IsTimeout(false);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MovieDetailScreen",
            params: {
              idTrip: 12,
              movieDetail: currentMovie,
              isTimeout: true,
            },
          },
        ],
      });
      return;
    }
    runTimeout();
    // console.log(value);
  }
  return (
    <BookingContext.Provider value={value}>
      {isTimeout && (
        <View
          style={{
            position: "absolute",
            top: 100,
            left: 10,
            right: 10,
            zIndex: 1,
          }}
        >
          <TimeOutBooking
            time={timeout}
            onTimeChange={onTimeChange}
            isDelete={isDeleteTimer}
          />
        </View>
      )}
      {children}
    </BookingContext.Provider>
  );
}

export default BookingContextProvider;
