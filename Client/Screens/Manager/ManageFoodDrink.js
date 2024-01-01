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
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import FoodDrinkCard from "./FoodDrinkCard";
import { useIsFocused } from "@react-navigation/native";
import { getAllFoodDrinks } from "../../Util/foodDrinkService";
import FilterFDModal from "./Popup/filterFDModal";

export default function ManageFoodDrink({navigation}) {
  const openMenu = () => {
    navigation.openDrawer();
  };
  const pressAddHandler = () => {
    navigation.navigate("AddFoodDrink");
  };
  const [indicator, setIndicator] = useState(false);

  const [fdList, setFDList] = useState([]);
  const [fdListData, setFDListData] = useState([]);

  const isFocused = useIsFocused();

  const fetchFoodDrinks = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllFoodDrinks();
        setFDList(data);
        setFDListData(data);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.error("Error fetching food drinks:", error);
        setIndicator(false);
      }
    }
  };

  useEffect(() => {
    fetchFoodDrinks();
  }, [isFocused]);

  const handlerFilter = (text) => {
    if (text) {
      let filteredList = fdListData.filter((fd) =>
        fd.name.toLowerCase().includes(text.toLowerCase())
      );

      setFDList(filteredList);
    } else {
      setFDList(fdListData);
    }
  };

  const [searchText, setSearchText] = useState("");

  const textHandler = (val) => {
    setSearchText(val);
    handlerFilter(val);
  };

  const deleteItem = (idItem) => {
    setFDList(fdList.filter(item => item.id != idItem));
    setFDListData(fdList.filter(item => item.id != idItem));
  }

  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  const handleSort = (pa) => {
    if(pa == "1"){
      let filteredList = fdListData.filter((fd) =>
        fd.category == "Popcorn");

      setFDList(filteredList);
      hide();
    }
    else if( pa == "2"){
      let filteredList = fdListData.filter((fd) =>
        fd.category == "Beverage");

      setFDList(filteredList);
      hide();
    }
    else if( pa == "3"){
      let filteredList = fdListData.filter((fd) =>
        fd.category == "Combo");

      setFDList(filteredList);
      hide();
    }
    else {
      setFDList(fdListData);
      hide();
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <FilterFDModal visible={visible} hide={hide} handlerSort={handleSort}/>
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

          <Text style={styles.headerText}>List of Food And Drink</Text>
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
                placeholder="Search for food & drink"
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
            <View style={styles.filter}>
              {/**filter */}
              <Pressable onPress={show}>
                <Ionicons name="md-filter" size={30} color="#72C6A1" />
              </Pressable>
            </View>
          </View>

          <View style={styles.bodyList}>
            <FlatList
              data={fdList}
              renderItem={({ item }) => (
                <Pressable
                onPress={() => navigation.navigate("ManageCinemaMenu", item)}
                >
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <FoodDrinkCard
                      item={item} navigation={navigation} deleteItem={deleteItem}
                    />
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
