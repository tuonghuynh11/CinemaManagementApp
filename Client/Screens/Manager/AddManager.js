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
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import placeholder from "../../../assets/noStaffImg.jpg";
import ModalChooseImage from "./ModalChooseImage";
import DropDownPicker from "react-native-dropdown-picker";
import { useIsFocused } from "@react-navigation/native";
import { getAllCinemas } from "../../Util/cinemaService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createUser, updateAUser } from "../../Util/userService";
import { createStaff, updateAStaff } from "../../Util/staffService";
import ModalSuccess from "../Manager/Popup/ModalSuccess";
import ModalFail from "../Manager/Popup/ModalFail";
import ModalConfirm from "../Manager/Popup/ModalConfirm";

DropDownPicker.setListMode("MODAL");

export default function AddManager({ navigation, route }) {
  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  //console.log(route.params);
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
    navigation.goBack();
  };

  const [validateManagerName, setValidateManagerName] = useState(true);
  const [ManagerName, setManagerName] = useState(route.params!=undefined?route.params.item.info.fullName:"");
  const ManagerNameHandler = (val) => {
    setManagerName(val);
    setValidateManagerName(true);
  };

  let tempDate;
  if(route.params!=undefined){
    tempDate = new Date(route.params.item.dateOfBirth);
  }
  const [validateDOB, setValidateDOB] = useState(true);
  const [DOBs, setDOB] = useState(tempDate!=undefined?tempDate.toLocaleDateString():"");
  const DOBHandler = (val) => {
    setDOB(val);
    setValidateDOB(true);
  };

  const [validatePhone, setValidatePhone] = useState(true);
  const [Phone, setPhone] = useState(route.params!=undefined?route.params.item.info.phoneNumber:"");
  const PhoneHandler = (val) => {
    setPhone(val);
    setValidatePhone(true);
  };
  const [validateEmail, setValidateEmail] = useState(true);
  const [Email, setEmail] = useState(route.params!=undefined?route.params.item.email:"");
  const EmailHandler = (val) => {
    setEmail(val);
    setValidateEmail(true);
  };
  const [validateUsername, setValidateUsername] = useState(true);
  const [Username, setUsername] = useState(route.params!=undefined?route.params.item.info.username:"");
  const UsernameHandler = (val) => {
    setUsername(val);
    setValidateUsername(true);
  };
  const [validatePassword, setValidatePassword] = useState(true);
  const [Password, setPassword] = useState(route.params!=undefined?route.params.item.info.password:"");
  const PasswordHandler = (val) => {
    setPassword(val);
    setValidatePassword(true);
  };

  const [validateRePassword, setValidateRePassword] = useState(true);
  const [RePassword, setRePassword] = useState(route.params!=undefined?route.params.item.info.password:"");
  const RePasswordHandler = (val) => {
    setRePassword(val);
    setValidateRePassword(true);
  };

  const [validateGender, setValidateGender] = useState(true);
  const [isOpenGender, setIsOpenGender] = useState(false);
  const [currentValueGender, setCurrentValueGender] = useState(route.params!=undefined?route.params.item.info.sex:"");
  const itemsGender = [
    {
      label: "Male",
      value: "male",
      labelStyle: {
        color: "#FFCE31",
      },
    },
    {
      label: "Female",
      value: "female",
      labelStyle: {
        color: "#FFCE31",
      },
    },
  ];

  const [cinemaList, setCinemaList] = useState([]);
  const [cinemaListData, setCinemaListData] = useState([]);
  const isFocused = useIsFocused();

  const fetchCinemas = async () => {
    if (isFocused) {
      try {
        //setIndicator(true);
        const data = await getAllCinemas();
        setCinemaList(data);
        setCinemaListData(data);
        //setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.log("Error fetching cinema:", error);
      }
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, [isFocused]);

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
        setDOB(currentDate.toLocaleDateString());
      }
    } else {
      toggleDatepickerShuttle();
    }
  };

  const [validateCinema, setValidateCinema] = useState(true);
  const [isOpenCinema, setIsOpenCinema] = useState(false);
  const [currentValueCinema, setCurrentValueCinema] = useState(route.params!=undefined?route.params.item.cinemaId:"");
  const itemsCinema = cinemaList.map((itemS) => ({
    label: itemS.name,
    value: itemS.id,
    labelStyle: {
      color: "#FFCE31",
    },
  }));
  // [
  //   {
  //     label: "CGV",
  //     value: "male",
  //     labelStyle: {
  //       color: "#FFCE31",
  //     },
  //   },
  //   {
  //     label: "BHD",
  //     value: "female",
  //     labelStyle: {
  //       color: "#FFCE31",
  //     },
  //   },
  // ];

  const [validateRole, setValidateRole] = useState(true);
  const [isOpenRole, setIsOpenRole] = useState(false);
  const [currentValueRole, setCurrentValueRole] = useState(route.params!=undefined?route.params.item.role:"");
  const itemsRole = [
    {
      label: "Manager",
      value: "Manager",
      labelStyle: {
        color: "#FFCE31",
      },
    },
    {
      label: "Staff",
      value: "Staff",
      labelStyle: {
        color: "#FFCE31",
      },
    },
  ];

  const saveHadler = async () => {
    if (ManagerName == "") {
      setValidateManagerName(false);
    } else {
      setValidateManagerName(true);
    }

    if (DOBs == "") {
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

    if (currentValueGender == "") {
      setValidateGender(false);
    } else {
      setValidateGender(true);
    }
    if (currentValueCinema == "") {
      setValidateCinema(false);
    } else {
      setValidateCinema(true);
    }
    let flag = 0;
    if (currentValueRole == "") {
      setValidateRole(false);
    } else {
      setValidateRole(true);
      
    }
    if (Username == "") {
      setValidateUsername(false);
    } else {
      setValidateUsername(true);
    }
    if (Password == "") {
      setValidatePassword(false);
    } else {
      setValidatePassword(true);
    }
    if (RePassword == "" || RePassword != Password) {
      setValidateRePassword(false);
    } else {
      setValidateRePassword(true);
    }
    if(ManagerName != "" && DOBs != "" && Phone != "" && Email != "" && currentValueGender != "" && currentValueCinema != "" && currentValueRole != "" && Username != "" && Password != "" && RePassword != "" && Password == RePassword){

      try{
        setIndicator(true);
        if(route.params == undefined){
          const userData = {
            username: Username,
            password: RePassword,
            fullName: ManagerName,
            phoneNumber: Phone,
            sex: currentValueGender,
            role: currentValueRole,
            address: ""
          }
  
  
          const createdUser = await createUser(userData);
  
          console.log(createdUser);
  
          const staffData = {
            userId: createdUser,
            dateOfBirth:dateShuttle,
            email: Email,
            role: currentValueRole,
            cinemaId: currentValueCinema
          }
  
          const createdStaff = await createStaff(staffData);
          console.log(createdStaff);
        }
        else{
          const oldUserData = {
            id: route.params.item.userId,

          }
          const newUserData = {
            username: Username,
            password: RePassword,
            fullName: ManagerName,
            phoneNumber: Phone,
            sex: currentValueGender,
            role: currentValueRole,
            address: ""
          }

          const updateUserData = {
            matching: oldUserData,
            updatedValue: newUserData
          }

          const updatedUser = await updateAUser(updateUserData);

          console.log(updatedUser)

          const oldStaffData = {
            userId: route.params.item.userId,

          }

          const newstaffData = {
            dateOfBirth:dateShuttle.toISOString(),
            email: Email,
            role: currentValueRole,
            cinemaId: currentValueCinema
          }
          const updatedStaffData = {
            matching: oldStaffData,
            updatedValue: newstaffData
          }
          const updatedStaff = await updateAStaff(updatedStaffData);
          console.log(updatedStaff);
        }
        setIndicator(false);
        showSuccess();
      }catch(err){
        console.log("error creating staff: " + err)
        setIndicator(false);
        showFail();
      }
    }
  };

  const reloadHandler = () => {};

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
          {route.params == undefined&&<Text style={styles.headerText}>New Personnel</Text>}
          {route.params != undefined&&<Text style={styles.headerText}>Edit Personnel</Text>}
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
          <Text style={styles.titleText}>Manager Information</Text>
          <View style={styles.coachInfoContainer}>
            {/* 3 textinput */}
            <Text style={styles.textLabel}>Personnel Name</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateManagerName == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Personnel Name"
              value={ManagerName}
              onChangeText={ManagerNameHandler}
            ></TextInput>
            {!validateManagerName && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            {openPickerShuttle && (
              <DateTimePicker
                mode={mode}
                display="spinner"
                value={dateShuttle}
                onChange={onChangeShuttle}
                is24Hour={true}
              />
            )}
            <Text style={styles.textLabel}>Date Of Birth</Text>
            <Pressable onPress={toggleDatepickerShuttle}>
              <TextInput
                editable={false}
                placeholderTextColor="#a28012"
                style={
                  validateDOB == true ? styles.textInput : styles.textInputWrong
                }
                placeholder="Choose Date Of Birth"
                value={DOBs}
                onChangeText={DOBHandler}
                onPressIn={toggleDatepickerShuttle}
              ></TextInput>
              {!validateDOB && (
                <Text style={styles.validateText}>
                  This field can't be empty
                </Text>
              )}
            </Pressable>
            <Text style={styles.textLabel}>Phone Number</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validatePhone == true ? styles.textInput : styles.textInputWrong
              }
              placeholder="Enter Phone Number"
              value={Phone}
              onChangeText={PhoneHandler}
              inputMode="numeric"
            ></TextInput>
            {!validatePhone && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Email Address</Text>
            <TextInput
              placeholderTextColor="#a28012"
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
            <Text style={styles.textLabel}>Gender</Text>
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
                items={itemsGender}
                open={isOpenGender}
                setOpen={() => setIsOpenGender(!isOpenGender)}
                value={currentValueGender}
                setValue={(val) => {
                  setCurrentValueGender(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select Gender"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                // onChangeValue={(val) => fetchDistricts(val)}
              />
            </View>
            {!validateGender && (
              <Text style={styles.validateText}>Please choose gender</Text>
            )}
            <Text style={styles.textLabel}>Cinema</Text>
            <View style={{ ...styles.dropDownStyle, zIndex: 50 }}>
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

            <Text style={styles.textLabel}>Role</Text>
            <View style={{ ...styles.dropDownStyle, zIndex: 50 }}>
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
                items={itemsRole}
                open={isOpenRole}
                setOpen={() => setIsOpenRole(!isOpenRole)}
                value={currentValueRole}
                setValue={(val) => {
                  setCurrentValueRole(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select Role"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                // onChangeValue={(val) => fetchDistricts(val)}
              />
            </View>
            {!validateRole && (
              <Text style={styles.validateText}>Please choose role</Text>
            )}
          </View>
          <Text style={styles.titleText}>Account Information</Text>
          <View>
            <Text style={styles.textLabel}>Username</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateUsername == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Username"
              value={Username}
              onChangeText={UsernameHandler}
            ></TextInput>
            {!validateUsername && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Password</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validatePassword == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Password"
              value={Password}
              onChangeText={PasswordHandler}
              secureTextEntry={true}
            ></TextInput>
            {!validatePassword && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Re-Password</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateRePassword == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Re-Enter Password"
              value={RePassword}
              onChangeText={RePasswordHandler}
              secureTextEntry={true}
            ></TextInput>
            {!validateRePassword && (
              <Text style={styles.validateText}>Re-password must be the same with password</Text>
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
  textLabel: {
    color: "#FFCE31",
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
