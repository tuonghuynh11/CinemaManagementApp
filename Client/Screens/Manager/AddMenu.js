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
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import placeholder from "../../../assets/noMovieImg.jpg";
import ModalChooseImage from "./ModalChooseImage";
import DropDownPicker from "react-native-dropdown-picker";
import { createMenu, updateMenu } from "../../Util/menuService";
import ModalSuccess from "../Manager/Popup/ModalSuccess";
import ModalFail from "../Manager/Popup/ModalFail";
import ModalConfirm from "../Manager/Popup/ModalConfirm";

DropDownPicker.setListMode("MODAL");

export default function AddMenu({navigation, route}) {
  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
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

  const [itemId, setItemid] = useState();

  const confirm = () => {
    const updatedArray = audis.filter((item) => item.id != itemId);
    
    setAudi(updatedArray);
    hideC();
  };

  const {name, id, description, imageUrl, category, cinemaList, cinemaId, availability, foodAndDrink, price, servingSize} = route.params;

  if(cinemaId){
    console.log("edit");

  }
  else{
    console.log("add");
  }


  const [validateName, setValidateName] = useState(true);
  const [Name, setName] = useState(name?name:foodAndDrink.name);
  const NameHandler = (val) => {
    setName(val);
    setValidateName(true);
  };

  const [validateCategory, setValidateCategory] = useState(true);
  const [Category, setCategory] = useState(category?category:foodAndDrink.category);
  const CategoryHandler = (val) => {
    setCategory(val);
    setValidateCategory(true);
  };

  const [validateDes, setValidateDes] = useState(true);
  const [Des, setDes] = useState(description?description:foodAndDrink.description);
  const DesHandler = (val) => {
    setDes(val);
    setValidateDes(true);
  };

  const [validatePrice, setValidatePrice] = useState(true);
  const [Price, setPrice] = useState((price)?price.toString():"");
  const PriceHandler = (val) => {
    setPrice(val);
    setValidatePrice(true);
  };

  const [validateSize, setValidateSize] = useState(true);
  const [isOpenSize, setIsOpenSize] = useState(false);
  const [currentValueSize, setCurrentValueSize] = useState(servingSize?servingSize:"");
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

  const [validateAvai, setValidateAvai] = useState(true);
  const [isOpenAvai, setIsOpenAvai] = useState(false);
  const [currentValueAvai, setCurrentValueAvai] = useState(availability?availability:undefined);
  const itemsAvai = [
    {
      label: "Available",
      value: true,
      labelStyle: {
        color: "#FFCE31",
      },
    },
    {
      label: "Unavailable",
      value: false,
      labelStyle: {
        color: "#FFCE31",
      },
    },
  ];

  const [validateCinema, setValidateCinema] = useState(true);
  const [isOpenCinema, setIsOpenCinema] = useState(false);
  const [currentValueCinema, setCurrentValueCinema] = useState(cinemaId?cinemaId:"");
  const itemsCinema = cinemaList.map(cinema => ({
    label: cinema.name,
    value: cinema.id,
    labelStyle: {
      color: "#FFCE31",
    },
  }));

  const saveHadler = async () => {
    if (Name == "") {
      setValidateName(false);
    } else {
      setValidateName(true);
    }

    if (Category == "") {
      setValidateCategory(false);
    } else {
      setValidateCategory(true);
    }

    if (Des == "") {
      setValidateDes(false);
    } else {
      setValidateDes(true);
    }
    if (currentValueAvai == undefined) {
      setValidateAvai(false);
    } else {
      setValidateAvai(true);
    }
    if (currentValueCinema == "") {
      setValidateCinema(false);
    } else {
      setValidateCinema(true);
    }
    if (currentValueSize == "") {
      setValidateSize(false);
    } else {
      setValidateSize(true);
    }
    if(Price == ""){
      setValidatePrice(false);
    } else {
      setValidatePrice(true);
    }

    if(currentValueAvai != undefined && currentValueCinema != "" && currentValueSize != "" && Price != ""){
      try{
        setIndicator(true);
        if(!cinemaId){
          const newData = {
            cinemaId: currentValueCinema,
            foodAndDrinkId: id,
            servingSize: currentValueSize,
            availability: currentValueAvai,
            price: parseFloat(Price)
          }
          const createdMenu = await createMenu(newData);
          console.log(createdMenu);

        }
        else{
          const oldData = {
            cinemaId: cinemaId,
            foodAndDrinkId: foodAndDrink.id,
            servingSize: servingSize,
            availability: availability
          }
          const newData = {
            cinemaId: currentValueCinema,
            foodAndDrinkId: foodAndDrink.id,
            servingSize: currentValueSize,
            availability: currentValueAvai,
            price: parseFloat(Price)
          }
          const updatedData = {
            matching: oldData,
            updatedValue: newData
          }
          const updatedMenu = await updateMenu(updatedData);
          console.log(updatedMenu);
        }
        setIndicator(false);
        showSuccess()
      }catch(err){
        console.log("Error creating menu: " + err);
        setIndicator(false);
        showFail();
      }
    }
  };

  const pressHandler = () => {
    navigation.goBack();
  };

  const reloadHandler = () => {setPrice("")};

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
          {!cinemaId&&<Text style={styles.headerText}>New Menu</Text>}
          {cinemaId&&<Text style={styles.headerText}>Edit Menu</Text>}
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
          <View style={styles.imageContainer}>
            <Image
              style={styles.staffImage}
              source={(imageUrl!=undefined && imageUrl!=null && imageUrl!="") ? { uri: imageUrl } : placeholder}
            />
          </View>
          {/* <Pressable
            style={({ pressed }) => [
              styles.editIcon,
              pressed && { opacity: 0.85 },
            ]}
            onPress={show}
          >
            <MaterialIcons name="edit" size={30} color="#72C6A1" />
          </Pressable>
          <ModalChooseImage
            visible={visible}
            hide={hide}
            uploadImage={uploadImage}
          /> */}
          <Text style={styles.titleText}>Menu Information</Text>
          <View style={styles.coachInfoContainer}>
            {/* 3 textinput */}
            <Text style={styles.textLabel}>Food & Drink Name</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateName == true ? styles.textInput : styles.textInputWrong
              }
              editable={false}
              placeholder="Enter Food & Drink Name"
              value={Name}
              onChangeText={NameHandler}
            ></TextInput>
            {!validateName && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
          </View>

          <View>
            <Text style={styles.textLabel}>Category</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateCategory == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              editable={false}
              placeholder="Enter Category"
              value={Category}
              onChangeText={CategoryHandler}
            ></TextInput>
            {!validateCategory && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Description</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateDes == true
                  ? styles.textInputMultiline
                  : styles.textInputMultilineWrong
              }
              editable={false}
              placeholder="Enter Description"
              value={Des}
              multiline
              onChangeText={DesHandler}
            ></TextInput>
            {!validateDes && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}

            <Text style={styles.textLabel}>Cinema</Text>
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
                items={itemsCinema}
                open={isOpenCinema}
                setOpen={() => setIsOpenCinema(!isOpenCinema)}
                value={currentValueCinema}
                setValue={(val) => {
                  setCurrentValueCinema(val);
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
            {!validateCinema && (
              <Text style={styles.validateText}>Please choose cinema</Text>
            )}
            <Text style={styles.textLabel}>Serving Size</Text>
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
            {!validateSize && (
              <Text style={styles.validateText}>Please choose size</Text>
            )}
            <Text style={styles.textLabel}>Availability</Text>
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
                items={itemsAvai}
                open={isOpenAvai}
                setOpen={() => setIsOpenAvai(!isOpenAvai)}
                value={currentValueAvai}
                setValue={(val) => {
                  setCurrentValueAvai(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select Availability"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                // onChangeValue={(val) => fetchDistricts(val)}
              />
            </View>
            {!validateAvai && (
              <Text style={styles.validateText}>
                Please choose availability
              </Text>
            )}
            <Text style={styles.textLabel}>Price ($)</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validatePrice == true
                  ? styles.textInput
                  : styles.textInputWrong
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
    borderRadius: 80,
    marginHorizontal: "30%",
    marginTop: 10,
    overflow: "hidden",
  },
  staffImage: {
    width: 120,
    height: 120,
    borderRadius: 80,
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
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 120,
    paddingTop: 18,
    borderColor: "#283663",
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
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
