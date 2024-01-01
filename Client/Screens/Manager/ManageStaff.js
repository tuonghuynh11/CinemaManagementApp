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
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import StaffMorning from "./StaffMorning";
import StaffAfternoon from "./StaffAfternoon";
import { NavigationContainer } from "@react-navigation/native";
import ManageManager from "./ManageManager";
import { getAllCinemas } from "../../Util/cinemaService";
import { getAllStaffs } from "../../Util/staffService";
const Tab = createMaterialTopTabNavigator();
function Tab1() {
  return <Text>tab1</Text>;
}
function Tab2() {
  return <Text>tab2</Text>;
}

function MyTabs() {
  //console.log(staffList);
  return (
    <Tab.Navigator
      initialRouteName="Working"
      screenOptions={{
        tabBarStyle: { backgroundColor: "#FFCE31" },
        tabBarLabelStyle: { fontSize: 16 },
        tabBarPressColor: "#b68c00",
        tabBarActiveTintColor: "#283663",
        tabBarIndicatorStyle: {
          backgroundColor: "#283663",
          height: 2,
        },
        swipeEnabled: false,
      }}
    >
      <Tab.Screen
        name="Manager"
        component={StaffMorning}
        options={{ tabBarLabel: "Staff" }}
      />
      <Tab.Screen
        name="Staff"
        component={ManageManager}
        options={{ tabBarLabel: "Manager"}}
      />
    </Tab.Navigator>
  );
}

export default function ManageStaff({navigation}) {
  const openMenu = () => {
    navigation.openDrawer();
  };
  const pressAddHandler = () => {
    navigation.navigate("AddManager");
  };
  

  

  //console.log(staffList);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
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

          <Text style={styles.headerText}>List Of Personnel</Text>
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
          

            <MyTabs />
          
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
});
