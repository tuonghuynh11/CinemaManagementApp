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
import CinemaCard from "./CinemaCard";
import { getAllCinemas } from "../../Util/cinemaService";

export default function ManageCinema({navigation}) {
  const openMenu = () => {
    navigation.openDrawer();
  };
  const pressAddHandler = () => {
    navigation.navigate("AddCinema");
  };
  const [indicator, setIndicator] = useState(false);

  const cinemas = [
    { id: "1", name: "Harry Potter", manager: 'Alan' , date: '1/1/2021'},
    { id: "2", name: "Harry Potter", manager: 'Alan' , date: '1/1/2021'},
    { id: "3", name: "Harry Potter", manager: 'Alan' , date: '1/1/2021'},
    { id: "4", name: "Harry Potter", manager: 'Alan' , date: '1/1/2021'},
    { id: "5", name: "Harry Potter", manager: 'Alan' , date: '1/1/2021'},
    { id: "6", name: "Harry Potter", manager: 'Alan' , date: '1/1/2021'},
    { id: "7", name: "Harry Potter", manager: 'Alan' , date: '1/1/2021'},
  ]

  const [cinemaList, setCinemaList] = useState([]);
  const [cinemaListData, setCinemaListData] = useState([]);
  const isFocused = useIsFocused();

  const fetchCinemas = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllCinemas();
        setCinemaList(data);
        setCinemaListData(data);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.log("Error fetching cinema:", error);
        setIndicator(false);
      }
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, [isFocused]);

  const deleteitem = (idItem) =>{
    setCinemaList(cinemaList.filter(item => item.id !=idItem));
    setCinemaListData(cinemaList.filter(item => item.id !=idItem));
  }


  const handlerFilter = (text) => {
    if(text){
      let filteredList = cinemaListData.filter((cinema) => cinema.name.toLowerCase().includes(text.toLowerCase()));

      setCinemaList(filteredList);
    }
    else{
        setCinemaList(cinemaListData);
    }
  }

  const [searchText, setSearchText] = useState("");

  const textHandler = (val) => {
    setSearchText(val);
    handlerFilter(val);
  };
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

          <Text style={styles.headerText}>List Of Cinemas</Text>
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
                placeholder="Search for cinema"
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
            
          </View>

          <View style={styles.bodyList}>
            <FlatList
              data={cinemaList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => navigation.navigate("ManageShowtime", item)}
                >
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <CinemaCard item={item} navigation={navigation} deleteItem={deleteitem}/>
                  </TouchableWithoutFeedback>
                </Pressable>
              )}
              keyExtractor={(item) => item.id}
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
  
