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
  } from "react-native";
  import React, { useState } from "react";
  import StaffCard from "./StaffCard";
  import { Ionicons } from "@expo/vector-icons";
  
  export default function StaffAfternoon() {
    const staffArternoon = [
      { id: "1", name: "Alan", gender: "male", email: "a@gmail.com" },
      { id: "2", name: "Alan", gender: "male", email: "a@gmail.com" },
      { id: "3", name: "Alan", gender: "male", email: "a@gmail.com" },
      { id: "4", name: "Alan", gender: "male", email: "a@gmail.com" },
      { id: "5", name: "Alan", gender: "male", email: "a@gmail.com" },
      { id: "6", name: "Alan", gender: "male", email: "a@gmail.com" },
    ];
    const [staffList, setStaffList] = useState(staffArternoon);

    const handlerFilter = (text) => {
        if (text) {
          let filteredList = staffArternoon.filter((staff) =>
            staff.name.toLowerCase().includes(text.toLowerCase())
          );
    
          setStaffList(filteredList);
        } else {
            setStaffList(movies);
        }
      };
    
      const [searchText, setSearchText] = useState("");
    
      const textHandler = (val) => {
        setSearchText(val);
        handlerFilter(val);
      };
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.bodySearch}>
              <TextInput
                style={styles.textInputSearch}
                placeholder="Search for staff"
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
              <Pressable>
                <Ionicons name="md-filter" size={30} color="#72C6A1" />
              </Pressable>
            </View>
          </View>
          <View style={styles.bodyList}>
            <FlatList
              data={staffList}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => {}}>
                  <StaffCard item={item} />
                </TouchableWithoutFeedback>
              )}
              keyExtractor={(item) => item.id}
            />
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
      color: "#283663",
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
  });
  