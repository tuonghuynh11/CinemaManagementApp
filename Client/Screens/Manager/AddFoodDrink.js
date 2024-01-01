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
import { createFoodDrink, updateFoodDrink } from "../../Util/foodDrinkService";
import ModalSuccess from "../Manager/Popup/ModalSuccess";
import ModalFail from "../Manager/Popup/ModalFail";
import ModalConfirm from "../Manager/Popup/ModalConfirm";
import { uploadimage } from "../../Util/uploadImageService";

DropDownPicker.setListMode("MODAL");

export default function AddFoodDrink({ navigation, route }) {
  let idData = "",
    nameData = "",
    
    categoryData = "",
    desData = "";
  let imageUrlData;
  if(route.params){
    if(route.params.imageUrl!=""){
      imageUrlData = route.params.imageUrl;
    }
  }
  const [image, setImage] = useState((imageUrlData)?imageUrlData:undefined);
  if (route.params != null) {
    const { id, name, imageUrl, category, description } = route.params;
    idData = id;
    nameData = name;

    categoryData = category;
    desData = description;
  }

  

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

  
  const uploadImage = async (mode) => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.front,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      alert("Error uploading image: " + error);
      setVisible(false);
    }
  };

  const saveImage = async (image) => {
    try {
      setImage(image);
      setVisible(false);
    } catch (error) {
      throw error;
    }
  };

  const [validateName, setValidateName] = useState(true);
  const [Name, setName] = useState(nameData);
  const NameHandler = (val) => {
    setName(val);
    setValidateName(true);
  };

  const [validateCategory, setValidateCategory] = useState(true);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [currentValueCategory, setCurrentValueCategory] =
    useState(categoryData);
  const itemsCategory = [
    {
      label: "Popcorn",
      value: "Popcorn",
      labelStyle: {
        color: "#FFCE31",
      },
    },
    {
      label: "Beverage",
      value: "Beverage",
      labelStyle: {
        color: "#FFCE31",
      },
    },
    {
      label: "Combo",
      value: "Combo",
      labelStyle: {
        color: "#FFCE31",
      },
    },
  ];

  const [validateDes, setValidateDes] = useState(true);
  const [Des, setDes] = useState(desData);
  const DesHandler = (val) => {
    setDes(val);
    setValidateDes(true);
  };

  const saveHadler = async () => {
    if (Name == "") {
      setValidateName(false);
    } else {
      setValidateName(true);
    }

    if (currentValueCategory == "") {
      setValidateCategory(false);
    } else {
      setValidateCategory(true);
    }

    if (Des == "") {
      setValidateDes(false);
    } else {
      setValidateDes(true);
    }

    if (Name != "" && currentValueCategory != "" && Des != "") {
      try {
        setIndicator(true)
        let imageurl = ""
        if(image != undefined){
          const res = await uploadimage(image);
          console.log(res.data.data.display_url);
          imageurl = res.data.data.display_url;
        }
        if (route.params != null) {
          const updatedId = { id: idData };
          const updatedValue = {
            name: Name,
            category: currentValueCategory,
            description: Des,
            imageUrl: imageurl,
          };
          const updatedData = {matching: updatedId, updatedValue: updatedValue};
          const updatedFD = await updateFoodDrink(updatedData);
          console.log(updatedFD);
        } else {
          const newData = {
            name: Name,
            category: currentValueCategory,
            description: Des,
            imageUrl: imageurl,
          };
          const createdFD = await createFoodDrink(newData);
          console.log(createdFD);
        }
        setIndicator(false);
        showSuccess();
      } catch (err) {
        console.error("Error creating food drink:" + err);
        setIndicator(false);
        showFail();
      }
    }
  };

  const pressHandler = () => {
    navigation.goBack();
  };

  const reloadHandler = () => {setName(""); setDes("")};

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
          {route.params == null && (
            <Text style={styles.headerText}>New Food & Drink</Text>
          )}
          {route.params != null && (
            <Text style={styles.headerText}>Edit Food & Drink</Text>
          )}
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
              source={image != undefined ? { uri: image } : placeholder}
            />
          </View>
          <Pressable
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
          />
          <Text style={styles.titleText}>Food & Drink Information</Text>
          <View style={styles.coachInfoContainer}>
            {/* 3 textinput */}
            <Text style={styles.textLabel}>Food & Drink Name</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateName == true ? styles.textInput : styles.textInputWrong
              }
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
                items={itemsCategory}
                open={isOpenCategory}
                setOpen={() => setIsOpenCategory(!isOpenCategory)}
                value={currentValueCategory}
                setValue={(val) => {
                  setCurrentValueCategory(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select Category"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                // onChangeValue={(val) => fetchDistricts(val)}
              />
            </View>
            {!validateCategory && (
              <Text style={styles.validateText}>Please choose category</Text>
            )}
            <Text style={styles.textLabel}>Description</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateDes == true
                  ? styles.textInputMultiline
                  : styles.textInputMultilineWrong
              }
              placeholder="Enter Description"
              value={Des}
              multiline
              onChangeText={DesHandler}
            ></TextInput>
            {!validateDes && (
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
