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
import ManagerCard from "./ManagerCard";
import { getAllStaffs } from "../../Util/staffService";
import { getAllUsers, getUserById } from "../../Util/userService";
import DropDownPicker from "react-native-dropdown-picker";
import { getAllCinemas } from "../../Util/cinemaService";

DropDownPicker.setListMode("MODAL");

export default function ManageManager({ route, navigation }) {
  const openMenu = () => {
    //navigation.openDrawer();
  };
  const pressAddHandler = () => {
    //navigation.navigate("AddCoach");
  };

  const [staffList, setStaffList] = useState([]);
  const [staffListData, setStaffListData] = useState([]);
  
  const [cinemaList, setCinemaList] = useState([]);
  const isFocused = useIsFocused();

  const fetchStaffs = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const data = await getAllStaffs();
        setStaffList(data.filter((item) => item.role == "Manager"));
        setStaffListData(data.filter((item) => item.role == "Manager"));
        const cinemaData = await getAllCinemas();
        setCinemaList(cinemaData);

        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.log("Error fetching staff:", error);
        setIndicator(false);
      }
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [isFocused]);

  // console.log(staffList);
  // console.log(userListData);

  const [isOpenSize, setIsOpenSize] = useState(false);
  const [currentValueSize, setCurrentValueSize] = useState("");
  const itemsSize = cinemaList.map((item) => ({
    label: item.name,
    value: item.id,
    labelStyle: {
      color: "#FFCE31",
    },
  }));

  
  const handlerFilter = () => {
    if (currentValueSize != "") {
      let filteredList = staffListData.filter((staff) =>
        staff.cinemaId == currentValueSize
      );

      setStaffList(filteredList);
    } else {
        setStaffList(staffListData);
    }
  };
  const [indicator, setIndicator] = useState(false);

  const deleteItem = (idItem) => {
    setStaffList(staffList.filter(item => item.userId != idItem));
    setStaffListData(staffList.filter(item => item.userId != idItem));
  }
  
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ActivityIndicator
          style={styles.indicator}
          size={"large"}
          animating={indicator}
        />
        <View style={styles.header}></View>
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
                  placeholder="Select Cinema"
                  showTickIcon={true}
                  style={styles.startDropDown}
                  nestedScrollEnabled={true}

                  // onChangeValue={(val) => fetchDistricts(val)}
                />
              </View>
            </View>
            <View style={{ ...styles.filter, zIndex: 100 }}>
              {/**filter */}
              <Pressable onPress={handlerFilter}>
                <Ionicons name="search" size={30} color="#72C6A1" />
              </Pressable>
            </View>
          </View>

          <View style={styles.bodyList}>
            <FlatList
              data={staffList}
              renderItem={({ item }) => (
                <Pressable
                //onPress={() => navigation.navigate("Tracking", item)}
                >
                  <TouchableWithoutFeedback onPress={() => {}}>
                    <ManagerCard item={item} navigation={navigation} deleteItem={deleteItem}/>
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
