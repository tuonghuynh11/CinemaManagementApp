import {
  SafeAreaView,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import CircleImage from "../../Components/UI/CircleImage";
import AuthInput from "../../Components/Authentication/AuthInput";
import { useContext, useEffect, useState } from "react";
import FlatButton from "../../Components/UI/FlatButton";
import GlobalColors from "../../Color/colors";
import CustomButton from "../../Components/UI/CustomButton";
import {
  EmailValidation,
  NameValidation,
  PhoneNumberValidation,
} from "../../Helper/Validation";
import PopUp from "../../Components/UI/PopUp";
import ChangePasswordPopUp from "../../Components/UI/ChangePasswordPopUp";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../Store/authContext";
import { sendEmail } from "../../Util/apiServices";
import { UpdateUserInformation, changePassword } from "../../Util/databaseAPI";
import { useIsFocused } from "@react-navigation/native";
import Loading from "../../Components/UI/Loading";
function EditProfileScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);

  const [enteredFullName, setEnteredFullName] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredUserName, setEnteredUserName] = useState("");
  const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");

  const [fullNameIsInvalid, setFullNameIsInvalid] = useState(false);
  const [addressIsInvalid, setAddressIsInvalid] = useState(false);
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [phoneNumberIsInvalid, setPhoneNumberIsInvalid] = useState(false);
  const [userNameIsInvalid, setUserNameIsInvalid] = useState(false);

  const [gender, setGender] = useState("male"); //0:male,1:female

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [popUpType, setPopUpType] = useState("Success");
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);

  const [profileInfo, setProfileInfo] = useState({});

  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  //Avatar
  //   const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [galleryPermissionInformation, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [avatar, setAvatar] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  async function verifyGalleryPermission() {
    if (
      galleryPermissionInformation.status ===
      ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }
    if (
      galleryPermissionInformation.status ===
      ImagePicker.PermissionStatus.DENIED
    ) {
      Alert.alert(
        "Insuficient Permission!",
        "You need to grant gallery permissions to change avatar"
      );

      return false;
    }
    return true;
  }
  async function getImageHandler() {
    const hasPermission = await verifyGalleryPermission();
    if (!hasPermission) {
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);

      const file = {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "image.jpeg",
      };
      setImageFile(file);
    }
  }

  useEffect(() => {
    //get profile information from database by userId
    const profileInfo = route?.params?.currentUser;

    // setAvatar(
    //   profileInfo.UserAccountData.avatar
    //     ? profileInfo.UserAccountData.avatar
    //     : null
    // );
    setGender(
      profileInfo.sex && profileInfo.sex !== "" ? profileInfo.sex : "male"
    );
    setEnteredFullName(profileInfo.fullName ? profileInfo.fullName : "");
    setEnteredAddress(profileInfo.address ? profileInfo.address : "");
    setEnteredEmail(profileInfo.email ? profileInfo.email : "");
    setEnteredPhoneNumber(
      profileInfo.phoneNumber ? profileInfo.phoneNumber : ""
    );
    setEnteredUserName(profileInfo.username ? profileInfo.username : "");
    setProfileInfo(profileInfo);

    // const profileInfo = {
    //   fullName: "Nguyen Van A",
    //   email: "a@gmail.com",
    //   phoneNumber: "0897878777",
    //   userName: "abcd",
    //   gender: "male", //0:male,1:female
    // };
    // setProfileInfo(profileInfo);
    // setEnteredFullName(profileInfo.fullName);
    // setEnteredEmail(profileInfo.email);
    // setEnteredPhoneNumber(profileInfo.phoneNumber);
    // setEnteredUserName(profileInfo.username);
    // setGender(profileInfo.gender);
  }, []);
  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "fullName":
        setEnteredFullName(enteredValue);
        break;
      case "userName":
        setEnteredUserName(enteredValue);
        break;

      case "phoneNumber":
        setEnteredPhoneNumber(enteredValue);
        break;
      case "address":
        setEnteredAddress(enteredValue);
        break;
    }
  }

  async function onChangeInfoHandler() {
    const emailIsValid = EmailValidation(enteredEmail);
    const useNameIsValid = NameValidation(enteredUserName);
    const fullNameIsValid = NameValidation(enteredFullName);
    const addressIsValid = NameValidation(enteredAddress);
    const phoneNumberIsValid = PhoneNumberValidation(enteredPhoneNumber);
    console.log(addressIsValid);

    if (
      !emailIsValid | !fullNameIsValid ||
      !phoneNumberIsValid ||
      !useNameIsValid ||
      !addressIsValid
    ) {
      setEmailIsInvalid(!emailIsValid);
      setUserNameIsInvalid(!useNameIsValid);
      setFullNameIsInvalid(!fullNameIsValid);
      setPhoneNumberIsInvalid(!phoneNumberIsValid);
      setAddressIsInvalid(!addressIsValid);
      return;
    }
    ///Call APi to update
    try {
      setEmailIsInvalid(false);
      setUserNameIsInvalid(false);
      setFullNameIsInvalid(false);
      setPhoneNumberIsInvalid(false);
      setAddressIsInvalid(false);
      //Success

      const profileInfo = route?.params?.currentUser;
      setIsLoading((curr) => !curr);
      const res = await UpdateUserInformation(authCtx.idUser, {
        email: !profileInfo.email ? enteredEmail : null,
        phoneNumber: !profileInfo.phoneNumber ? enteredPhoneNumber : null,
        fullName: !profileInfo.fullName ? enteredFullName : null,

        address: !profileInfo.address ? enteredAddress : null,
        sex: !profileInfo.sex ? gender : null,
      });
      // const emails = await sendEmail("len856638@gmail.com", "123564");
      if (res === null) {
        setIsLoading((curr) => !curr);

        throw new Error("Something went wrong");
      }
      setIsLoading((curr) => !curr);

      setPopUpType("Success");

      setIsPopUpVisible((curr) => !curr);
      setIsEdit(false);
    } catch (error) {
      //Failure
      setIsPopUpVisible((curr) => !curr);
      setPopUpType("Error");
    }
  }

  async function onChangePasswordHandlers(oldPassword, newPassword) {
    try {
      console.log(enteredPhoneNumber, newPassword);
      const res = await changePassword(
        authCtx.idUser,
        oldPassword,
        newPassword
      );
      // console.log(res === null);
      // return;
      if (res == null) {
        Alert.alert("Error", "Something went wrong");
      } else if (res == 0) {
        Alert.alert("Error", "Old Password incorrect");
      } else {
        setIsChangePasswordVisible((curr) => !curr);
        setTimeout(() => {
          setPopUpType("Success");
          setIsUpdatePassword(true);
          setIsPopUpVisible((curr) => !curr);

          setTimeout(() => {
            setIsPopUpVisible((curr) => !curr);
            setTimeout(() => {
              authCtx.logout();
            }, 500);
          }, 2000);
        }, 500);
      }
    } catch (error) {
      Alert.alert("Error", error);
    }
  }

  function GenderComponent({ gender, isDisabled = false }) {
    if (isDisabled) {
      gender =
        profileInfo.sex && profileInfo.sex !== "" ? profileInfo.sex : "male";
    }
    // console.log(profileInfo.sex ? profileInfo.sex : "male");
    return (
      <View
        style={{
          flexDirection: "row",
          borderRadius: 10,
          borderColor: "gray",
          borderWidth: 0.5,
          width: 121,
        }}
      >
        <Pressable
          style={(pressed) => [
            {
              padding: 10,
              borderColor: "gray",
              // borderRightWidth: 0.5,
              backgroundColor:
                gender === "male"
                  ? GlobalColors.lightBackground
                  : "transparent",
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            },
          ]}
          onPress={() => {
            setGender("male");
          }}
          disabled={isDisabled}
        >
          <Text
            style={{
              fontSize: 14,
              color: gender === "male" ? "white" : "black",
              fontWeight: "500",
            }}
          >
            Male
          </Text>
        </Pressable>
        <Pressable
          style={(pressed) => [
            {
              padding: 10,
              backgroundColor:
                gender === "female"
                  ? GlobalColors.lightBackground
                  : "transparent",
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            },
          ]}
          onPress={() => setGender("female")}
          disabled={isDisabled}
        >
          <Text
            style={{
              fontSize: 14,
              color: gender === "female" ? "white" : "black",
              fontWeight: "500",
            }}
          >
            Female
          </Text>
        </Pressable>
      </View>
    );
  }
  return (
    <>
      {isLoading && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: GlobalColors.lightBackground,
            opacity: 0.5,
          }}
        >
          <Loading />
        </View>
      )}

      <ChangePasswordPopUp
        isVisible={isChangePasswordVisible}
        onCancel={() => setIsChangePasswordVisible((curr) => !curr)}
        onChangePasswordHandler={onChangePasswordHandlers}
      />
      <PopUp
        isVisible={isPopUpVisible}
        isNotButton={isUpdatePassword && popUpType === "Success"}
        type={popUpType}
        title={popUpType == "Success" ? "Success" : "Failure"}
        textBody={
          isUpdatePassword
            ? "Password has been updated. Please sign in again!!"
            : popUpType == "Success"
            ? "Your information has updated"
            : "Connection Error!!"
        }
        callback={() => setIsPopUpVisible((curr) => !curr)}
      />
      <KeyboardAvoidingView
        enabled
        style={{ flex: 1, height: "100%", justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <TouchableWithoutFeedback
            style={styles.root}
            onPress={Keyboard.dismiss}
          >
            <View style={styles.subRoot}>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
                onPress={() => {
                  const profileInfo = route?.params?.currentUser;
                  setGender(
                    profileInfo.sex && profileInfo.sex !== ""
                      ? profileInfo.sex
                      : "male"
                  );
                  setEnteredFullName(
                    profileInfo.fullName ? profileInfo.fullName : ""
                  );
                  setEnteredAddress(
                    profileInfo.address ? profileInfo.address : ""
                  );
                  setEnteredEmail(profileInfo.email ? profileInfo.email : "");
                  setEnteredPhoneNumber(
                    profileInfo.phoneNumber ? profileInfo.phoneNumber : ""
                  );
                  setEnteredUserName(
                    profileInfo.username ? profileInfo.username : ""
                  );
                  setEmailIsInvalid(false);
                  setUserNameIsInvalid(false);
                  setFullNameIsInvalid(false);
                  setPhoneNumberIsInvalid(false);
                  setAddressIsInvalid(false);
                  setIsEdit((curr) => !curr);
                }}
              >
                <MaterialIcons name="edit" size={30} color="#72C6A1" />
              </TouchableOpacity>
              <CircleImage
                image={avatar}
                size={120}
                isEdit={isEdit}
                onPress={getImageHandler}
              />
              <View style={{ width: "100%" }}>
                <AuthInput
                  label="Full Name"
                  keyboardType="default"
                  onUpdateValue={updateInputValueHandler.bind(this, "fullName")}
                  value={enteredFullName}
                  isInvalid={fullNameIsInvalid}
                  placeholder="Nguyen Van A"
                  message={"Full Name is required"}
                  isDisabled={!isEdit}
                />
                <AuthInput
                  label="Address"
                  keyboardType="default"
                  onUpdateValue={updateInputValueHandler.bind(this, "address")}
                  value={enteredAddress}
                  isInvalid={addressIsInvalid}
                  placeholder="Street 2, A City "
                  message={"Address is required"}
                  isDisabled={!isEdit}
                />
                <AuthInput
                  label="Email"
                  keyboardType="email-address"
                  onUpdateValue={updateInputValueHandler.bind(this, "email")}
                  value={enteredEmail}
                  isInvalid={emailIsInvalid}
                  placeholder="a@gmail.com"
                  message={"Email is invalided"}
                  isDisabled={!isEdit}
                />
                <AuthInput
                  label="Phone Number"
                  keyboardType="number-pad"
                  onUpdateValue={updateInputValueHandler.bind(
                    this,
                    "phoneNumber"
                  )}
                  value={enteredPhoneNumber}
                  isInvalid={phoneNumberIsInvalid}
                  placeholder="0xxxxxxx"
                  message={"Phone Number is invalided"}
                  isDisabled={!isEdit}
                />
                <AuthInput
                  label="User Name (*)"
                  keyboardType="default"
                  onUpdateValue={updateInputValueHandler.bind(this, "userName")}
                  value={enteredUserName}
                  // isInvalid={userNameIsInvalid}
                  // placeholder="Nguyen Van A"
                  message={"User Name is required"}
                  isDisabled
                />
                <AuthInput
                  label="Password (*)"
                  keyboardType="default"
                  secure={true}
                  // onUpdateValue={updateInputValueHandler.bind(this, "password")}
                  value={"dasdasadasd"}
                  isDisabled
                />
                <View style={{ width: "100%", alignItems: "flex-end" }}>
                  <FlatButton
                    color={GlobalColors.validate}
                    onPress={() => {
                      setIsChangePasswordVisible((curr) => !curr);
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Change Password ?
                    </Text>
                  </FlatButton>
                </View>
                <GenderComponent gender={gender} isDisabled={!isEdit} />
              </View>
              {isEdit && (
                <View style={{ width: "100%" }}>
                  <CustomButton
                    radius={10}
                    color={"#72C6A1"}
                    onPress={onChangeInfoHandler}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Submit
                    </Text>
                  </CustomButton>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
export default EditProfileScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: GlobalColors.contentBackground,
    gap: 20,
  },
  subRoot: {
    backgroundColor: "white",
    alignItems: "center",
    margin: 20,
    borderRadius: 20,
    padding: 20,
    gap: 10,
    paddingVertical: 20,
    marginBottom: 90,
  },
});
