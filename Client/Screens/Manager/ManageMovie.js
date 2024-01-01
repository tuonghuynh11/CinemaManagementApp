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
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import MovieCard from "./MovieCard";
import { getAllMovie } from "../../Util/movieService";

export default function ManageMovie({navigation}) {
  const openMenu = () => {
    navigation.openDrawer();
  };
  const pressAddHandler = () => {
    navigation.navigate("AddMovie");
  };

  const movies = [
    { id: "1", name: "Harry Potter", status: "Coming Soon", Director: 'Alan' },
    { id: "2", name: "Harry Potter", status: "Coming Soon", Director: 'Alan' },
    { id: "3", name: "Harry Potter", status: "Coming Soon", Director: 'Alan' },
    { id: "4", name: "Harry Potter", status: "Coming Soon", Director: 'Alan' },
    { id: "5", name: "Harry Potter", status: "Coming Soon", Director: 'Alan' },
    { id: "6", name: "Harry Potter", status: "Coming Soon", Director: 'Alan' },
  ]

  const [indicator, setIndicator] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [movieListData, setMovieListData] = useState([]);
  const isFocused = useIsFocused();

  const fetchMovies = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllMovie();
        setMovieList(data);
        setMovieListData(data);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.log("Error fetching movie:", error);
        setIndicator(false);
      }
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [isFocused]);

  const handlerFilter = (text) => {
    if(text){
      let filteredList = movieListData.filter((movie) => movie.originalTitle.toLowerCase().includes(text.toLowerCase()));

      setMovieList(filteredList);
    }
    else{
      setMovieList(movieListData);
    }
  }

  const [searchText, setSearchText] = useState("");

  const textHandler = (val) => {
    setSearchText(val);
    handlerFilter(val);
  };
  const deleteItem = (idItem) => {
    setMovieList(movieList.filter(item => item.id != idItem));
    setMovieListData(movieList.filter(item => item.id != idItem));
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
              styles.menuIcon,
              pressed && { opacity: 0.85 },
            ]}
            onPress={openMenu}
          >
            <Entypo name="menu" size={30} color="#FFCE31" />
          </Pressable>

          <Text style={styles.headerText}>List Of Movies</Text>
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
              <TextInput
                style={styles.textInputSearch}
                placeholder="Search for movie"
                placeholderTextColor="#FFFFFF"
                onChangeText={textHandler}
                value={searchText}
              ></TextInput>
              {searchText !== "" && (
                <View style={styles.iconCancel}>
                  <Pressable
                    onPress={() => {
                      setSearchText("");
                      handlerFilter("");
                    }}
                  >
                    <MaterialIcons name="cancel" size={30} color="white" />
                  </Pressable>
                </View>
              )}
            </View>
            {/* <View style={styles.filter}>
              
              <Pressable>
                <Ionicons name="md-filter" size={30} color="#72C6A1" />
              </Pressable>
            </View> */}
          </View>

          <View style={styles.bodyList}>
            <FlatList
              data={movieList}
              renderItem={({ item }) => (
                <Pressable
                  //onPress={() => navigation.navigate("Tracking", item)}
                >
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <MovieCard item={item} deleteItem={deleteItem} //navigation={navigation} 
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
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
