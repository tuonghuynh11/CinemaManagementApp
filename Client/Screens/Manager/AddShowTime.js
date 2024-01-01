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
  ScrollView,
  Image,
  ActivityIndicator,
  
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import placeholder from "../../../assets/noMovieImg.jpg";
import ModalChooseImage from "./ModalChooseImage";
import DropDownPicker from "react-native-dropdown-picker";
import {
  getAllDistrict,
  getAllProvince,
  getAllWard,
} from "../../Util/locationService";
import AudiCard from "./AudiCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createShowtime, updateShowtime } from "../../Util/showtimeService";
import ModalSuccess from "../Manager/Popup/ModalSuccess";
import ModalFail from "../Manager/Popup/ModalFail";
import ModalConfirm from "../Manager/Popup/ModalConfirm";

DropDownPicker.setListMode("MODAL");

export default function AddShowTime({navigation, route}) {
  const pressHandler = () =>{
    navigation.goBack();
  }

  const {audiList, movieList, id, showtime} = route.params;
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

  const [itemId, setItemid] = useState();

  const confirm = () => {
    const updatedArray = audis.filter((item) => item.id != itemId);
    
    setAudi(updatedArray);
    hideC();
  };
  
  
  const [validateAudi, setValidateAudi] = useState(true);
  const [isOpenAudi, setIsOpenAudi] = useState(false);
  
  const itemsAudi = audiList?audiList.filter(item=>item.cinemaId == id).map(item=>({
    label: item.name,
    value: item.id,
    labelStyle: {
      color: "#FFCE31",
    },
  })):[];
  const [currentValueAudi, setCurrentValueAudi] = useState(showtime?showtime.auditoriumId:"");
  //console.log(itemsAudi);
  
  const [validateMovie, setValidateMovie] = useState(true);
  const [isOpenMovie, setIsOpenMovie] = useState(false);
  const [currentValueMovie, setCurrentValueMovie] = useState(showtime?showtime.movieId:"");
  const itemsMovie = movieList?movieList.map(item=>({
    label: item.originalTitle,
    value: item.id,
    labelStyle: {
      color: "#FFCE31",
    },
  })):[];

  let editDate;
  if(showtime){
    editDate = new Date(showtime.date)
  }
  
  const [validateDate, setValidateDate] = useState(true);
  const [date, setDate] = useState(showtime?editDate.toLocaleDateString():"");
  const DateHandler = (val) => {
    setDate(val);
    setValidateDate(true);
  };

  const [validatePrice, setValidatePrice] = useState(true);
  const [Price, setPrice] = useState(showtime?showtime.price.toString():"");
  const PriceHandler = (val) => {
    setPrice(val);
    setValidatePrice(true);
  };

  const [validateTime, setValidateTime] = useState(true);
  const [Time, setTime] = useState(showtime?showtime.startTime:"");
  const TimeHandler = (val) => {
    setTime(val);
    setValidateTime(true);
  };

  const [mode, setMode] = useState("date");
  const [dateShuttle, setDateShuttle] = useState(new Date());
  const [openPickerShuttle, setOpenPickerShuttle] = useState(false);
  const toggleDatepickerShuttle = () => {
    if (mode == "time") {
      setMode("date");
    } 
    setOpenPickerShuttle(!openPickerShuttle);
  };
  const onChangeShuttle = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setDateShuttle(currentDate);
      if (Platform.OS === "android") {
        toggleDatepickerShuttle();
        setDate(currentDate.toLocaleDateString());
      }
    } else {
      toggleDatepickerShuttle();
    }
  };

  const [modeT, setModeT] = useState("time");
  const [timeShuttle, setTimeShuttle] = useState(new Date());
  const [openPicker, setOpenPicker] = useState(false);
  const toggleDatepicker = () => {
    if (mode == "date") {
      setModeT("time");
    } 
    setOpenPicker(!openPicker);
  };
  const onChange= ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setTimeShuttle(currentDate);
      if (Platform.OS === "android") {
        toggleDatepicker();
        setTime(currentDate.toLocaleTimeString());
      }
    } else {
      toggleDatepicker();
    }
  };

  const saveHadler = async () => {
    if (date == "") {
      setValidateDate(false);
    } else {
      setValidateDate(true);
    }
    if (Time == "") {
      setValidateTime(false);
    } else {
      setValidateTime(true);
    }
    if (Price == "") {
      setValidatePrice(false);
    } else {
      setValidateTime(true);
    }
    if (currentValueAudi == "") {
      setValidateAudi(false);
    } else {
      setValidateAudi(true);
    }
    if (currentValueMovie == "") {
      setValidateMovie(false);
    } else {
      setValidateMovie(true);
    }
    if(date != "" && Time != "" && Price != "" && currentValueAudi != "" && currentValueMovie != ""){
      try{
        if(!showtime){
          setIndicator(true);
          const newData = {
            movieId: currentValueMovie,
            status: "available",
            price: parseFloat(Price),
            auditoriumId: currentValueAudi,
            date: dateShuttle,
            startTime: timeShuttle.toLocaleTimeString(),
            ceaseTime: timeShuttle.toLocaleTimeString()
          }
          
          const createdShowtime = await createShowtime(newData);
          console.log(createdShowtime);
          setIndicator(false);
          showSuccess()
        }
        else{
          setIndicator(true);
          const oldData = {id: showtime.id};
          const newData = {
            movieId: currentValueMovie,
            status: "available",
            price: parseFloat(Price),
            auditoriumId: currentValueAudi,
            date: dateShuttle,
            startTime: timeShuttle.toLocaleTimeString(),
            ceaseTime: timeShuttle.toLocaleTimeString()
          }

          const updateData = {
            matching: oldData,
            updatedValue: newData
          }
          const updatedShowtime = await updateShowtime(updateData);
          console.log(updatedShowtime);
          setIndicator(false);
          showSuccess()
        }
      }catch(err){
        console.err("error creating showtime:" + err);
        setIndicator(false);
        showFail();
      }
    }
  };

  const reloadHandler = () => {setDate(""); setTime(""); setPrice("");};
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerText}>New Showtime</Text>
          <Pressable
            style={({ pressed }) => [
              styles.resetIconStyle,
              pressed && { opacity: 0.85 },
            ]}
            onPress={reloadHandler}
          >
            <Ionicons name="reload-circle" size={38} color="#EB3223" />
          </Pressable>
        </View>
        <ScrollView
          style={styles.body}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.titleText}>Showtime Information</Text>
          <View style={styles.coachInfoContainer}>
            {/* 3 textinput */}
            <Text style={styles.textLabel}>Movie Name</Text>
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
                items={itemsMovie}
                open={isOpenMovie}
                setOpen={() => setIsOpenMovie(!isOpenMovie)}
                value={currentValueMovie}
                setValue={(val) => {
                  setCurrentValueMovie(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select Movie"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                // onChangeValue={(val) => fetchDistricts(val)}
              />
            </View>
            {!validateMovie && (
              <Text style={styles.validateText}>Please choose movie</Text>
            )}
          </View>

          <View>
          {openPickerShuttle && (
                <DateTimePicker
                  mode={mode}
                  display="spinner"
                  value={dateShuttle}
                  onChange={onChangeShuttle}
                  is24Hour={true}
                />
              )}
            <Text style={styles.textLabel}>Date</Text>
            <Pressable onPress={toggleDatepickerShuttle}>
              <TextInput
                placeholderTextColor="#a28012"
                editable={false}
                style={
                  validateDate == true ? styles.textInput : styles.textInputWrong
                }
                placeholder="Enter Date"
                value={date}
                onChangeText={DateHandler}
                onPressIn={toggleDatepickerShuttle}
              ></TextInput>
              {!validateDate && (
                <Text style={styles.validateText}>This field can't be empty</Text>
              )}
            </Pressable>
            {openPicker && (
                <DateTimePicker
                  mode={modeT}
                  display="spinner"
                  value={timeShuttle}
                  onChange={onChange}
                  is24Hour={true}
                />
              )}
            <Text style={styles.textLabel}>Start Time</Text>
            <Pressable onPress={toggleDatepicker}>

              <TextInput
                placeholderTextColor="#a28012"
                editable={false}
                style={
                  validateTime == true ? styles.textInput : styles.textInputWrong
                }
                placeholder="Enter Start Time"
                value={Time}
                onChangeText={TimeHandler}
                onPressIn={toggleDatepicker}
              ></TextInput>
              {!validateTime && (
                <Text style={styles.validateText}>This field can't be empty</Text>
              )}
            </Pressable>

            <Text style={styles.textLabel}>Auditorium</Text>
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
                items={itemsAudi}
                open={isOpenAudi}
                setOpen={() => setIsOpenAudi(!isOpenAudi)}
                value={currentValueAudi}
                setValue={(val) => {
                  setCurrentValueAudi(val);
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
            {!validateAudi && (
              <Text style={styles.validateText}>Please choose auditorium</Text>
            )}
            <Text style={styles.textLabel}>Price</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validatePrice == true ? styles.textInput : styles.textInputWrong
              }
              placeholder="Enter Price"
              value={Price}
              onChangeText={PriceHandler}
              inputMode="numeric"
            ></TextInput>
            {!validatePrice && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={saveHadler}
          >
            <Text style={styles.saveText}>SAVE</Text>
          </Pressable>
        </ScrollView>
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
  backIcon: {
    position: "absolute",
    left: 16,
  },
  headerText: {
    fontSize: 23,
    color: "#FFCE31",
  },
  resetIconStyle: {
    position: "absolute",
    right: 16,
  },
  body: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "0%",
    marginTop: 10,
    overflow: "hidden",
  },
  staffImage: {
    width: 240,
    height: 320,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFCE31",
    zIndex: 100,
  },
  editIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  titleText: {
    color: "#FFCE31",
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: "#283663",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 50,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#FFCE31",
    borderWidth: 1,
    color: "#FFCE31",
  },
  textInputWrong: {
    backgroundColor: "#283663",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 50,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#EB3223",
    borderWidth: 1,
    color: "#FFCE31",
  },
  textInputMultiline: {
    backgroundColor: "#283663",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 100,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#FFCE31",
    borderWidth: 1,
    color: "#FFCE31",
    textAlignVertical: "top",
    paddingVertical: 5,
  },
  textInputMultilineWrong: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 100,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#EB3223",
    borderWidth: 1,
    color: "#FFCE31",
    textAlignVertical: "top",
    paddingVertical: 5,
  },
  textLabel: {
    color: "#FFCE31",
    marginLeft: 34,
    marginBottom: 5,
    marginTop: 10,
  },

  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#72C6A1",
    marginHorizontal: "30%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  addText: {
    fontSize: 16,
    color: "white",
  },
  listService: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#141f42",
    borderRadius: 10,
    height: 180,
    borderColor: "#FFCE31",
    borderWidth: 1,
  },
  listGenre: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#141f42",
    borderRadius: 10,
    height: 120,
    borderColor: "#FFCE31",
    borderWidth: 1,
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFCE31",
    marginHorizontal: "10%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 30,
  },
  saveText: {
    fontSize: 16,
    color: "#0C1941",
  },
  validateText: {
    color: "#EB3223",
    marginLeft: 40,
  },
  dropDownStyle: {
    paddingRight: 20,
    paddingLeft: 20,
  },
  startDropDown: {
    zIndex: 100,
    borderColor: "#FFCE31",
    color: "#FFCE31",
    paddingLeft: 20,
  },
  addIconStyle: {
    position: "absolute",
    top: 350,
    left: "85%",
    zIndex: 100,
  },
  addIconActorStyle: {
    position: "absolute",
    top: 1070,
    left: "85%",
    zIndex: 100,
  },
  addIconDirectorStyle: {
    position: "absolute",
    top: 840,
    left: "85%",
    zIndex: 100,
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
