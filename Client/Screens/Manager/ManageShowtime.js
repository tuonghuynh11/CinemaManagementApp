import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import ShowtimeCard from "./ShowtimeCard";
import { getAllShowtimes } from "../../Util/showtimeService";
import { getAllAuditoriums } from "../../Util/auditoriumService";
import { getAllMovie } from "../../Util/movieService";
import DropDownPicker from "react-native-dropdown-picker";

DropDownPicker.setListMode("MODAL");

export default function ManageShowtime({ navigation, route }) {
  const pressHandler = () => {
    navigation.goBack();
  };
  const pressAddHandler = () => {
    navigation.navigate("AddShowTime", { audiList, movieList, id });
  };

  const { id } = route.params;
  const [indicator, setIndicator] = useState(false);

  const showtimes = [
    { id: "1", movie: "Harry Potter", audi: "Room 1", time: "10h30" },
    { id: "2", movie: "Harry Potter", audi: "Room 1", time: "10h30" },
    { id: "3", movie: "Harry Potter", audi: "Room 1", time: "10h30" },
    { id: "4", movie: "Harry Potter", audi: "Room 1", time: "10h30" },
    { id: "5", movie: "Harry Potter", audi: "Room 1", time: "10h30" },
    { id: "6", movie: "Harry Potter", audi: "Room 1", time: "10h30" },
  ];

  const [showtimeList, setShowtimeList] = useState([]);
  const isFocused = useIsFocused();
  const [showtimeListData, setShowtimeListData] = useState([]);

  const [audiList, setAudiList] = useState([]);
  const [movieList, setMovieList] = useState([]);

  const fetchShowtimes = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        //setIndicator(true);
        const audi = await getAllAuditoriums();
        const audiid = audi
          .filter((item) => item.cinemaId == id)
          .map((item) => item.id);
        //console.log(audiid);
        const data = await getAllShowtimes();
        setShowtimeList(
          data.filter((item) => audiid.includes(item.auditoriumId))
        );
        setShowtimeListData(
          data.filter((item) => audiid.includes(item.auditoriumId))
        );
        setAudiList(audi);
        const movie = await getAllMovie();
        setMovieList(movie);
        setIndicator(false);
        //setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.log("Error fetching showtimes:", error);
        setIndicator(false);
      }
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, [isFocused]);

  const [isOpenSize, setIsOpenSize] = useState(false);
  const [currentValueSize, setCurrentValueSize] = useState("");
  const itemsSize = audiList.filter((item) => item.cinemaId == id).map((item) => ({
    label: item.name,
    value: item.id,
    labelStyle: {
      color: "#FFCE31",
    },
  }));

  const handlerFilter = () => {
    if(currentValueSize!=""){
      
      let filteredList = showtimeListData.filter((cinema) => cinema.auditoriumId == currentValueSize);

      setShowtimeList(filteredList);
    }
    else{
      
      setShowtimeList(showtimeListData);
    }
  };

  const deleteItem = (idItem) => {
    setShowtimeList(showtimeListData.filter(item => item.id != idItem));
    setShowtimeListData(showtimeListData.filter(item => item.id != idItem));
  }
  

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ActivityIndicator
          style={styles.indicator}
          size={"large"}
          animating={indicator}
        />
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backIcon,
              pressed && { opacity: 0.85 },
            ]}
            onPress={pressHandler}
          >
            <Ionicons
              name="ios-arrow-back-circle-sharp"
              size={38}
              color="#FFCE31"
            />
          </Pressable>
          <Text style={styles.headerText}>List Of Showtimes</Text>
          <Pressable
            style={({ pressed }) => [
              styles.addIconStyle,
              pressed && { opacity: 0.85 },
            ]}
            onPress={pressAddHandler}
          >
            <AntDesign name="pluscircle" size={30} color="#FFCE31" />
          </Pressable>
        </View>
        <View style={styles.body}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.bodySearch}>
            <View style={{ ...styles.dropDownStyle, zIndex: 100 }}>
              <DropDownPicker
                placeholderStyle={{
                  color: "#a28012",
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#283663",
                }}
                modalProps={{
                  animationType: "slide",
                }}
                modalContentContainerStyle={{
                  backgroundColor: "#283663",
                }}
                theme="DARK"
                items={itemsSize}
                open={isOpenSize}
                setOpen={() => setIsOpenSize(!isOpenSize)}
                value={currentValueSize}
                setValue={(val) => {
                  setCurrentValueSize(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select Auditorium"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                
                // onChangeValue={(val) => fetchDistricts(val)}
              />
            </View>
            </View>
            <View style={{...styles.filter, zIndex: 100}}>
              {/**filter */}
              <Pressable onPress={handlerFilter}>
                <Ionicons name="search" size={30} color="#72C6A1" />
              </Pressable>
            </View>
          </View>

          <View style={styles.bodyList}>
            <FlatList
              data={showtimeList}
              renderItem={({ item }) => (
                <Pressable
                //onPress={() => navigation.navigate("Tracking", item)}
                >
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <ShowtimeCard
                      item={item}
                      navigation={navigation}
                      audiList={audiList}
                      movieList={movieList}
                      cinemaId={id}
                      deleteItem={deleteItem}
                    />
                  </TouchableWithoutFeedback>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
              windowSize={5}
              maxToRenderPerBatch={10}
            />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    backgroundColor: "#0C1941",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    position: "absolute",
    left: 16,
  },
  headerText: {
    fontSize: 23,
    color: "#FFCE31",
  },
  addIconStyle: {
    position: "absolute",
    right: 16,
  },
  body: {
    flex: 1,
  },
  bodySearch: {
    flex: 8,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  textInputSearch: {
    backgroundColor: "#283663",
    flex: 1,
    paddingLeft: 20,
    paddingRight: 40,
    paddingVertical: 8,
    borderRadius: 10,
    height: 54,
    color: "white",
  },
  iconCancel: {
    position: "absolute",
    top: 28,
    right: 20,
  },
  bodyList: {
    flex: 1,
  },
  filter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingEnd: 6,
  },
  backIcon: {
    position: "absolute",
    left: 16,
  },
  dropDownStyle: {
    paddingRight: 130,
    paddingLeft: 20,
  },
  startDropDown: {
    zIndex: 100,
    borderColor: "#FFCE31",
    color: "#FFCE31",
    paddingLeft: 20,
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
