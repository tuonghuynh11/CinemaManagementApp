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
import CinemaMenuCard from "./CinemaMenuCard";
import { getAllMenu } from "../../Util/menuService";
import { getAllCinemas } from "../../Util/cinemaService";
import DropDownPicker from "react-native-dropdown-picker";

DropDownPicker.setListMode("MODAL");

export default function ManageCinemaMenu({ navigation, route }) {
  const openMenu = () => {
    //navigation.openDrawer();
  };
  const pressAddHandler = () => {
    navigation.navigate("AddMenu", {...route.params, cinemaList});
  };
  const [indicator, setIndicator] = useState(false);

  const { id } = route.params;

  const [cinemaMenuList, setCinemaMenuList] = useState([]);
  const [cinemaMenuListData, setCinemaMenuListData] = useState([]);
  const [cinemaList, setCinemaList] = useState([]);

  const isFocused = useIsFocused();

  const fetchMenus = async () => {
    if (isFocused) {
      try {
        
        setIndicator(true);
        const data = await getAllMenu();
        setCinemaMenuList(data.filter((item) => item.foodAndDrinkId == id));
        setCinemaMenuListData(data.filter((item) => item.foodAndDrinkId == id));

        const dataCi = await getAllCinemas();
        setCinemaList(dataCi);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching food drinks:", error);
        setIndicator(false);
      }
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [isFocused]);

  const [validateSize, setValidateSize] = useState(true);
  const [isOpenSize, setIsOpenSize] = useState(false);
  const [currentValueSize, setCurrentValueSize] = useState("");
  const itemsSize = [
    {
      label: "Large",
      value: "large",
      labelStyle: {
        color: "#FFCE31",
      },
    },
    {
      label: "Medium",
      value: "medium",
      labelStyle: {
        color: "#FFCE31",
      },
    },
    {
      label: "Small",
      value: "small",
      labelStyle: {
        color: "#FFCE31",
      },
    },
  ];

  const filterHandler = () => {
    if(currentValueSize!=""){
      
      let filteredList = cinemaMenuListData.filter((cinema) => cinema.servingSize.toLowerCase().includes(currentValueSize.toLowerCase()));

      setCinemaMenuList(filteredList);
    }
    else{
      
      setCinemaMenuList(cinemaMenuListData);
    }
  }

  const backHandler = () => {
    navigation.goBack();
  };

  const deleteItem = (idCi, idFD) => {
    setCinemaMenuList(cinemaMenuList.filter(item => item.cinemaId != idCi && item.foodAndDrinkId == idFD));
    setCinemaMenuListData(cinemaMenuList.filter(item => item.cinemaId != idCi && item.foodAndDrinkId == idFD));
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
            onPress={backHandler}
          >
            <Ionicons
              name="ios-arrow-back-circle-sharp"
              size={38}
              color="#FFCE31"
            />
          </Pressable>

          <Text style={styles.headerText}>List Of Cinema Menu</Text>
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
                placeholder="Select Size"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                
                // onChangeValue={(val) => fetchDistricts(val)}
              />
            </View>
            </View>
            <View style={{...styles.filter, zIndex: 100}}>
              {/**filter */}
              <Pressable onPress={filterHandler}>
                <Ionicons name="search" size={30} color="#72C6A1" />
              </Pressable>
            </View>
            
          </View>

          <View style={styles.bodyList}>
            <FlatList
              data={cinemaMenuList}
              renderItem={({ item }) => (
                <Pressable
                //onPress={() => navigation.navigate("Tracking", item)}
                >
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <CinemaMenuCard item={item} cinemaList={cinemaList} navigation={navigation} deleteItem={deleteItem}/>
                  </TouchableWithoutFeedback>
                </Pressable>
              )}
              keyExtractor={(item, index) => index}
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
