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
import { createCinema, updateCinema } from "../../Util/cinemaService";
import {
  createAuditorium,
  deleteAuditorium,
  getAllAuditoriums,
} from "../../Util/auditoriumService";
import ModalSuccess from "../Manager/Popup/ModalSuccess";
import ModalFail from "../Manager/Popup/ModalFail";
import ModalConfirm from "../Manager/Popup/ModalConfirm";

DropDownPicker.setListMode("MODAL");

export default function AddCinema({ navigation, route }) {
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

  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  const [indicator, setIndicator] = useState(false);
  let idCinema, nameCinema, addressCinema;
  if (route.params) {
    const { id, name, address } = route.params;
    idCinema = id;
    nameCinema = name;
    addressCinema = address;
  }

  let temp = [];
  if (route.params) {
    temp = addressCinema.split(", ");
  }

  const [isOpenDepProvince, setIsOpenDepProvince] = useState(false);
  const [currentValueDepProvince, setCurrentValueDepProvince] = useState("");
  const [provinceData, setProvinceData] = useState([]);

  const fetchProvinces = async () => {
    try {
      setIndicator(true);
      const data = await getAllProvince();
      setProvinceData(data.results);
      if (temp[3]) {
        const defaultValue = data.results.find(
          (province) => province.province_name === temp[3]
        );
        if (defaultValue) {
          setCurrentValueDepProvince(defaultValue.province_id);
          fetchDepDistricts(defaultValue.province_id);
        }
      }
      if (idCinema) {
        const audi = await getAllAuditoriums();
        setAudi(
          audi
            .filter((item) => item.cinemaId == idCinema)
            .map((item) => ({ name: item.name }))
        );
      }
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching provinces:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const itemsDepProvince = provinceData.map(
    ({ province_id, province_name }) => ({
      value: province_id,
      label: province_name,
      labelStyle: {
        color: "#FFCE31",
      },
    })
  );
  const itemsDesProvince = provinceData.map(
    ({ province_id, province_name }) => ({
      value: province_id,
      label: province_name,
    })
  );

  const [isOpenDepDistrict, setIsOpenDepDistrict] = useState(false);
  const [currentValueDepDistrict, setCurrentValueDepDistrict] = useState("");
  const [isOpenDesDistrict, setIsOpenDesDistrict] = useState(false);
  const [currentValueDesDistrict, setCurrentValueDesDistrict] = useState("");

  const [depDistrictData, setDepDistrictData] = useState([]);
  const [desDistrictData, setDesDistrictData] = useState([]);

  const fetchDepDistricts = async (val) => {
    try {
      // console.log(val);
      setIndicator(true);
      const data = await getAllDistrict(val);
      setDepDistrictData(data.results);
      if (temp[2]) {
        const defaultValue = data.results.find(
          (district) => district.district_name === temp[2]
        );
        if (defaultValue) {
          setCurrentValueDepDistrict(defaultValue.district_id);
          fetchDepWard(defaultValue.district_id);
        }
      }
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching districts:", error);
    }
  };

  const fetchDesDistricts = async (val) => {
    try {
      // console.log(val);
      setIndicator(true);
      const data = await getAllDistrict(val);
      setDesDistrictData(data.results);
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching districts:", error);
    }
  };

  // useEffect(() => {
  //   fetchDistricts();
  // }, [currentValueDepProvince]);

  const itemsDepDistrict = depDistrictData.map(
    ({ district_id, district_name }) => ({
      value: district_id,
      label: district_name,
      labelStyle: {
        color: "#FFCE31",
      },
    })
  );
  const itemsDesDistrict = desDistrictData.map(
    ({ district_id, district_name }) => ({
      value: district_id,
      label: district_name,
    })
  );

  const [isOpenDepWard, setIsOpenDepWard] = useState(false);
  const [currentValueDepWard, setCurrentValueDepWard] = useState("");
  const [isOpenDesWard, setIsOpenDesWard] = useState(false);
  const [currentValueDesWard, setCurrentValueDesWard] = useState("");
  const [depWardData, setDepWardData] = useState([]);
  const [desWardData, setDesWardData] = useState([]);

  const fetchDepWard = async (val) => {
    try {
      // console.log(val);
      setIndicator(true);
      const data = await getAllWard(val);
      setDepWardData(data.results);
      if (temp[1]) {
        const defaultValue = data.results.find(
          (ward) => ward.ward_name === temp[1]
        );
        if (defaultValue) {
          setCurrentValueDepWard(defaultValue.ward_id);
        }
      }
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching wards:", error);
    }
  };

  const itemsDepWard = depWardData.map(({ ward_id, ward_name }) => ({
    value: ward_id,
    label: ward_name,
    labelStyle: {
      color: "#FFCE31",
    },
  }));

  const itemsDesWard = desWardData.map(({ ward_id, ward_name }) => ({
    value: ward_id,
    label: ward_name,
    labelStyle: {
      color: "#FFCE31",
    },
  }));

  const fetchDesWard = async (val) => {
    try {
      // console.log(val);
      setIndicator(true);
      const data = await getAllWard(val);
      setDesWardData(data.results);
      setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.error("Error fetching wards:", error);
    }
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
  const [validateCinemaName, setValidateCinemaName] = useState(true);
  const [CinemaName, setCinemaName] = useState(nameCinema ? nameCinema : "");
  const CinemaNameHandler = (val) => {
    setCinemaName(val);
    setValidateCinemaName(true);
  };
  const [validateEsDate, setValidateEsDate] = useState(true);
  const [EsDate, setEsDate] = useState("");
  const EsDateHandler = (val) => {
    setEsDate(val);
    setValidateEsDate(true);
  };
  const [validateLocation, setValidateLocation] = useState(true);
  const [Location, setLocation] = useState(temp[0] ? temp[0] : "");
  const LocationHandler = (val) => {
    setLocation(val);
    setValidateLocation(true);
  };

  const [validateAudiName, setValidateAudiName] = useState(true);
  const [AudiName, setAudiName] = useState("");
  const AudiNameHandler = (val) => {
    setAudiName(val);
    setValidateAudiName(true);
  };

  const [audis, setAudi] = useState([]);

  const saveHadler = async () => {
    if (CinemaName == "") {
      setValidateCinemaName(false);
    } else {
      setValidateCinemaName(true);
    }

    if (Location == "") {
      setValidateLocation(false);
    } else {
      setValidateLocation(true);
    }

    if (currentValueDepDistrict == "") {
      setValidateDepDistrict(false);
    } else {
      setValidateDepDistrict(true);
    }

    if (currentValueDepProvince == "") {
      setValidateDepProvince(false);
    } else {
      setValidateDepProvince(true);
    }

    if (currentValueDepWard == "") {
      setValidateDepWard(false);
    } else {
      setValidateDepWard(true);
    }

    if (
      CinemaName != "" &&
      Location != "" &&
      currentValueDepDistrict != "" &&
      currentValueDepProvince != "" &&
      currentValueDepWard != ""
    ) {
      if (!idCinema) {
        try {
          setIndicator(true);
          const locationPlace =
            Location +
            ", " +
            itemsDepWard.find((item) => item.value === currentValueDepWard)
              .label +
            ", " +
            itemsDepDistrict.find(
              (item) => item.value === currentValueDepDistrict
            ).label +
            ", " +
            itemsDepProvince.find(
              (item) => item.value === currentValueDepProvince
            ).label;
          const cinemaData = {
            name: CinemaName,
            address: locationPlace,
          };
          const createdCinema = await createCinema(cinemaData);
          const cinemaId = createdCinema;

          for (const item of audis) {
            const dataWithCinemaId = { name: item.name, cinemaId: cinemaId };
            console.log(dataWithCinemaId);
            try {
              const createdAuditorium = await createAuditorium(
                dataWithCinemaId
              );
              console.log(
                "Auditorium created successfully:",
                createdAuditorium
              );
            } catch (error) {
              console.error("Error creating auditorium:", error);
            }
          }
          setIndicator(false);
          showSuccess();
        } catch (err) {
          setIndicator(false);
          showFail()
        }
      } else {
        try{
          setIndicator(true);
          const oldCiData = {
            id: idCinema,
          };
          const locationPlace =
            Location +
            ", " +
            itemsDepWard.find((item) => item.value === currentValueDepWard)
              .label +
            ", " +
            itemsDepDistrict.find(
              (item) => item.value === currentValueDepDistrict
            ).label +
            ", " +
            itemsDepProvince.find(
              (item) => item.value === currentValueDepProvince
            ).label;
          const cinemaData = {
            name: CinemaName,
            address: locationPlace,
          };
          const updatedCiData = {
            matching: oldCiData,
            updatedValue: cinemaData,
          };
  
          const updatedCinema = await updateCinema(updatedCiData);
  
          const audiData = {
            cinemaId: idCinema,
          };
          const deletedAuditorium = await deleteAuditorium(audiData);
  
          for (const item of audis) {
            const dataWithCinemaId = { name: item.name, cinemaId: idCinema };
            console.log(dataWithCinemaId);
            try {
              const createdAuditorium = await createAuditorium(dataWithCinemaId);
              console.log("Auditorium created successfully:", createdAuditorium);
            } catch (error) {
              console.error("Error creating auditorium:", error);
            }
          }
  
          console.log("Success");
          setIndicator(false);
          showSuccess();
        }catch(err){
          setIndicator(false);
          showFail();
        }
        
      }

      // const createdAuditoriums = await Promise.all(auditoriumsPromises);
      // console.log('Cinema and Auditoriums created successfully:', { cinemaId, createdAuditoriums });
    }
  };

  const addHandler = () => {
    if (AudiName == "") {
      setValidateAudiName(false);
    } else {
      setValidateAudiName(true);
      const newAudi = {
        id: audis.length,
        name: AudiName
      }
      setAudi([newAudi, ...audis]);
    }
  };

  const [validateDepProvince, setValidateDepProvince] = useState(true);
  const [validateDepDistrict, setValidateDepDistrict] = useState(true);
  const [validateDepWard, setValidateDepWard] = useState(true);

  const reloadHandler = () => {setCinemaName(""); setLocation(""); setAudiName(""); setAudi([]);};
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
          <Text style={styles.headerText}>New Cinema</Text>
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
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* <View style={styles.imageContainer}>
            <Image
              style={styles.cinemaImage}
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
          /> */}
          <Text style={styles.titleText}>Cinema Information</Text>
          <View style={styles.coachInfoContainer}>
            {/* 3 textinput */}
            <Text style={styles.textLabel}>Cinema Name</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateCinemaName == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Cinema Name"
              value={CinemaName}
              onChangeText={CinemaNameHandler}
            ></TextInput>
            {!validateCinemaName && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}

            <Text style={styles.textLabel}>Province</Text>
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
                items={itemsDepProvince}
                open={isOpenDepProvince}
                setOpen={() => setIsOpenDepProvince(!isOpenDepProvince)}
                value={currentValueDepProvince}
                setValue={(val) => {
                  setCurrentValueDepProvince(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select Province"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                // onChangeValue={(val) => fetchDistricts(val)}
                onSelectItem={(val) => fetchDepDistricts(val.value)}
              />
            </View>
            {!validateDepProvince && (
              <Text style={styles.validateText}>Please choose province</Text>
            )}
            <Text style={styles.textLabel}>District</Text>
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
                items={itemsDepDistrict}
                open={isOpenDepDistrict}
                setOpen={() => setIsOpenDepDistrict(!isOpenDepDistrict)}
                value={currentValueDepDistrict}
                setValue={(val) => {
                  setCurrentValueDepDistrict(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select District"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                // onChangeValue={(val) => fetchDistricts(val)}
                onSelectItem={(val) => fetchDepWard(val.value)}
              />
            </View>
            {!validateDepDistrict && (
              <Text style={styles.validateText}>Please choose district</Text>
            )}
            <Text style={styles.textLabel}>Ward</Text>
            <View style={{ ...styles.dropDownStyle, zIndex: 40 }}>
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
                items={itemsDepWard}
                open={isOpenDepWard}
                setOpen={() => setIsOpenDepWard(!isOpenDepWard)}
                value={currentValueDepWard}
                setValue={(val) => {
                  setCurrentValueDepWard(val);
                }}
                maxHeight={150}
                autoScroll
                placeholder="Select Ward"
                showTickIcon={true}
                style={styles.startDropDown}
                nestedScrollEnabled={true}
                // onChangeValue={(val) => fetchDistricts(val)}
                //onSelectItem={(val) => fetchDepDistricts(val.value)}
              />
            </View>
            {!validateDepWard && (
              <Text style={styles.validateText}>Please choose ward</Text>
            )}
            <Text style={styles.textLabel}>Detail Location</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateLocation == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Detail Location"
              value={Location}
              onChangeText={LocationHandler}
            ></TextInput>
            {!validateLocation && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.titleText}>Auditorium Information</Text>
            <Text style={styles.textLabel}>Auditorium Name</Text>
            <TextInput
              placeholderTextColor="#a28012"
              style={
                validateAudiName == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Auditorium Name"
              value={AudiName}
              onChangeText={AudiNameHandler}
            ></TextInput>
            {!validateAudiName && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && { opacity: 0.85 },
              ]}
              onPress={addHandler}
            >
              <Text style={styles.saveText}>ADD</Text>
            </Pressable>
            <View style={styles.listAudi}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                // nestedScrollEnabled={true}
                horizontal={true}
                data={audis}
                renderItem={({ item}) => (
                  <Pressable
                    onLongPress={() => {
                      showC();
                      setItemid(item.id);
                    }}
                  >
                    <AudiCard item={item}></AudiCard>
                  </Pressable>
                )}
                keyExtractor={(item, index) => index}
              />
            </View>
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
  cinemaImage: {
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
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFCE31",
    marginHorizontal: "30%",
    height: 50,
    marginBottom: 10,
    borderRadius: 20,
    marginTop: 30,
  },
  listAudi: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#141f42",
    borderRadius: 10,
    height: 120,
    borderColor: "#FFCE31",
    borderWidth: 1,
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
