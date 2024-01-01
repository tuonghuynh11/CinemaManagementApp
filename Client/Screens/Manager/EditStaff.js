import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import placeholder from "../../../assets/noStaffImg.jpg";
import ModalChooseImage from "./ModalChooseImage";

export default function EditStaff() {
  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const [image, setImage] = useState();
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

  const pressHandler = () => {
    //navigation.goBack();
  };
  const [validateStaffName, setValidateStaffName] = useState(true);
  const [StaffName, setStaffName] = useState("");
  const StaffNameHandler = (val) => {
    setStaffName(val);
    setValidateStaffName(true);
  };

  const [validateDOB, setValidateDOB] = useState(true);
  const [DOB, setDOB] = useState("");
  const DOBHandler = (val) => {
    setDOB(val);
    setValidateDOB(true);
  };

  const [validatePhone, setValidatePhone] = useState(true);
  const [Phone, setPhone] = useState("");
  const PhoneHandler = (val) => {
    setPhone(val);
    setValidatePhone(true);
  };
  const [validateEmail, setValidateEmail] = useState(true);
  const [Email, setEmail] = useState("");
  const EmailHandler = (val) => {
    setEmail(val);
    setValidateEmail(true);
  };
  const saveHadler = () => {
    if (StaffName == "") {
      setValidateStaffName(false);
    } else {
      setValidateStaffName(true);
    }

    if (DOB == "") {
      setValidateDOB(false);
    } else {
      setValidateDOB(true);
    }

    if (Phone == "") {
      setValidatePhone(false);
    } else {
      setValidatePhone(true);
    }

    if (Email == "") {
      setValidateEmail(false);
    } else {
      setValidateEmail(true);
    }
  };

  const reloadHandler = () => {};

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
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
              color="#283663"
            />
          </Pressable>
          <Text style={styles.headerText}>Edit Staff</Text>
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
              source={image ? { uri: image } : placeholder}
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
          <Text style={styles.titleText}>Staff Information</Text>
          <View style={styles.coachInfoContainer}>
            {/* 3 textinput */}
            <Text style={styles.textLabel}>Staff Name</Text>
            <TextInput
              style={
                validateStaffName == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Staff Name"
              value={StaffName}
              onChangeText={StaffNameHandler}
            ></TextInput>
            {!validateStaffName && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Date Of Birth</Text>
            <TextInput
              style={
                validateDOB == true ? styles.textInput : styles.textInputWrong
              }
              placeholder="Choose Date Of Birth"
              value={DOB}
              onChangeText={DOBHandler}
            ></TextInput>
            {!validateDOB && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Gender</Text>
            <Text style={styles.textLabel}>Phone Number</Text>
            <TextInput
              style={
                validatePhone == true ? styles.textInput : styles.textInputWrong
              }
              placeholder="Enter Phone Number"
              value={Phone}
              onChangeText={PhoneHandler}
            ></TextInput>
            {!validatePhone && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Email Address</Text>
            <TextInput
              style={
                validateEmail == true ? styles.textInput : styles.textInputWrong
              }
              placeholder="Enter Email Address"
              value={Email}
              onChangeText={EmailHandler}
            ></TextInput>
            {!validateEmail && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Shift</Text>
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
    backgroundColor: "#FFFFFF",
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
    color: "#283663",
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
    borderColor: "#283663",
    zIndex: 100,
  },
  editIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  titleText: {
    color: "#283663",
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 50,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#283663",
    borderWidth: 1,
    color: "#283663",
  },
  textInputWrong: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 50,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#EB3223",
    borderWidth: 1,
    color: "#283663",
  },
  textLabel: {
    color: "#283663",
    marginLeft: 34,
    marginBottom: 5,
    marginTop: 10,
  },
  textInputMultiline: {
    backgroundColor: "white",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 100,
    paddingLeft: 20,
    paddingRight: 40,
    borderRadius: 10,
    borderColor: "#283663",
    borderWidth: 1,
    color: "#283663",
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
    color: "#283663",
    textAlignVertical: "top",
    paddingVertical: 5,
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
    backgroundColor: "#283663",
    marginHorizontal: "10%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
  },
  saveText: {
    fontSize: 16,
    color: "white",
  },
  validateText: {
    color: "#EB3223",
    marginLeft: 40,
  },
});
