import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import placeholder from "../../../assets/noMovieImg.jpg";
import { deleteMenu } from "../../Util/menuService";
import ModalSuccess from "../Manager/Popup/ModalSuccess";
import ModalFail from "../Manager/Popup/ModalFail";
import ModalConfirm from "../Manager/Popup/ModalConfirm";

export default function CinemaMenuCard({
  item,
  navigation,
  cinemaList,
  deleteItem,
}) {
  let cinemaName = cinemaList.find((cinema) => cinema.id == item.cinemaId);

  if (!cinemaName) {
    cinemaName = "";
  }

  const pressHandler = () => {
    navigation.navigate("AddMenu", { ...item, cinemaList });
  };
  const [indicator, setIndicator] = useState(false);

  const contentS = "Successfully!";
  const [visibleSuccess, setVisibleSuccess] = useState(false);
  const showSuccess = () => {
    setVisibleSuccess(true);
  };
  const hideSuccess = () => {
    setVisibleSuccess(false);
  };

  const contentF = "Oops! Something wrong";
  const [visibleFail, setVisibleFail] = useState(false);
  const showFail = () => {
    setVisibleFail(true);
  };
  const hideFail = () => {
    setVisibleFail(false);
  };

  const contentC = "Are you sure to delete?";
  const [visibleC, setVisibleC] = useState(false);
  const showC = () => {
    setVisibleC(true);
  };
  const hideC = () => {
    setVisibleC(false);
  };

  const confirm = async () => {
    try {
      setIndicator(true);
      const deleteData = {
        cinemaId: item.cinemaId,
        foodAndDrinkId: item.foodAndDrinkId,
        servingSize: item.servingSize,
        availability: item.availability,
      };
      const deletedMenu = await deleteMenu(deleteData);
      console.log(deletedMenu);
      deleteItem(item.cinemaId, item.foodAndDrinkId);
      setIndicator(false);
      showSuccess();
    } catch (err) {
      console.error("Error deleting menu:" + err);
      setIndicator(false);
      showFail();
    }
  };

  const deleteHandler = async () => {
    showC();
    //console.log(item);
  };

  return (
    <View style={styles.container}>
      {/*status*/}
      <ActivityIndicator
        style={styles.indicator}
        size={"large"}
        animating={indicator}
      />
      <ModalSuccess
        visible={visibleSuccess}
        hide={hideSuccess}
        content={contentS}
      />
      <ModalFail visible={visibleFail} hide={hideFail} content={contentF} />
      <ModalConfirm
        visible={visibleC}
        hide={hideC}
        content={contentC}
        confirm={confirm}
      />
      <View style={styles.contentView}>
        {/**Image of coach */}

        {/* <Image style={styles.imageMovie} source={placeholder} /> */}

        <View style={styles.info}>
          {/**coachnum, type */}
          <Text style={styles.text}>Cinema: {cinemaName.name}</Text>
          <Text style={styles.text}>Size: {item.servingSize}</Text>
          <Text style={styles.text}>Price: {item.price}$</Text>
        </View>
        <View style={styles.edit}>
          {/*icon edit and delete*/}
          <Pressable
            style={({ pressed }) => [styles.icon, pressed && { opacity: 0.6 }]}
            onPress={pressHandler}
          >
            <MaterialIcons name="edit" size={35} color="#72C6A1" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.icon, pressed && { opacity: 0.6 }]}
            onPress={deleteHandler}
          >
            <MaterialIcons name="delete" size={35} color="#EB3223" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#283663",
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  statusText: {
    color: "white",
    backgroundColor: "#72C6A1",
    fontSize: 20,
    width: "40%",
    borderRadius: 10,
    textAlign: "center",
    margin: 5,
  },
  statusTextArr: {
    color: "white",
    backgroundColor: "#e9dd01",
    fontSize: 20,
    width: "40%",
    borderRadius: 10,
    textAlign: "center",
    margin: 5,
  },
  contentView: {
    flex: 1,
    flexDirection: "row",
  },
  imageMovie: {
    flex: 3,
    width: 120,
    height: 100,
    resizeMode: "contain",
    marginLeft: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 15,
  },
  info: {
    flex: 7,
    paddingTop: 10,
    paddingLeft: 15,
    paddingBottom: 10,
  },
  edit: {
    flex: 1,
    paddingEnd: 5,
  },
  text: {
    flex: 1,
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  icon: {
    flex: 1,
    paddingTop: 5,
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
