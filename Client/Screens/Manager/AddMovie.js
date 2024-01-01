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
import placeholder from "../../../assets/noMovieImg.jpg";
import ModalChooseImage from "./ModalChooseImage";
import DropDownPicker from "react-native-dropdown-picker";
import ActorCard from "./ActorCard";
import GenreCard from "./GenresCard";
import GenreModal from "./Popup/GenreModal";
import ActorModal from "./Popup/ActorModal";
import DirectorModal from "./Popup/DirectorModal";
import { getCastOfMovie, getMovieDetailById, getTrendMovie } from "../../Util/movieSourceService";
import ModalSuccess from "../Manager/Popup/ModalSuccess";
import ModalFail from "../Manager/Popup/ModalFail";
import ModalConfirm from "../Manager/Popup/ModalConfirm";
import { createMovie } from "../../Util/movieService";

DropDownPicker.setListMode("MODAL");

export default function AddMovie({ navigation }) {
  const [indicator, setIndicator] = useState(false);
  const [visible, setVisible] = useState(false);
  const show = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };

  const [visibleG, setVisibleG] = useState(false);
  const showG = () => {
    setVisibleG(true);
  };
  const hideG = () => {
    setVisibleG(false);
  };

  const [visibleA, setVisibleA] = useState(false);
  const showA = () => {
    setVisibleA(true);
  };
  const hideA = () => {
    setVisibleA(false);
  };

  const [visibleD, setVisibleD] = useState(false);
  const showD = () => {
    setVisibleD(true);
  };
  const hideD = () => {
    setVisibleD(false);
  };

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

  const [movieData, setMoviveData] = useState([]);
  const fetchMovies = async () => {
    try {
      setIndicator(true);
      //setIndicator(true);
      const data = await getTrendMovie()
      setMoviveData(data);
      setIndicator(false);
      //setIndicator(false);
    } catch (error) {
      // Handle error, e.g., redirect to login if unauthorized
      console.log("Error fetching movie:", error);
      setIndicator(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const [isOpenMovie, setIsOpenMovie] = useState(false);
  const [currentValueMovie, setCurrentValueMovie] = useState("");
  const itemMovie = movieData.map(item => ({
    label: item.original_title,
    value: item.id,
    labelStyle: {
      color: "#FFCE31",
    },
  }))

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

  const [validateName, setValidateName] = useState(true);
  const [Name, setName] = useState("");
  const NameHandler = (val) => {
    setName(val);
    setValidateName(true);
  };

  const [validateCategory, setValidateCategory] = useState(true);
  const [Category, setCategory] = useState("");
  const CategoryHandler = (val) => {
    setCategory(val);
    setValidateCategory(true);
  };

  const [validateLang, setValidateLang] = useState(true);
  const [Lang, setLang] = useState("");
  const LangHandler = (val) => {
    setLang(val);
    setValidateLang(true);
  };

  const [validateReDate, setValidateReDate] = useState(true);
  const [ReDate, setReDate] = useState("");
  const ReDateHandler = (val) => {
    setReDate(val);
    setValidateReDate(true);
  };

  const [validateBudget, setValidateBudget] = useState(true);
  const [Budget, setBudget] = useState("");
  const BudgetHandler = (val) => {
    setBudget(val);
    setValidateBudget(true);
  };

  const [validateCountry, setValidateCountry] = useState(true);
  const [Country, setCountry] = useState("");
  const CountryHandler = (val) => {
    setCountry(val);
    setValidateCountry(true);
  };

  const [validateRuntime, setValidateRuntime] = useState(true);
  const [Runtime, setRuntime] = useState("");
  const RuntimeHandler = (val) => {
    setRuntime(val);
    setValidateRuntime(true);
  };

  const [validateDes, setValidateDes] = useState(true);
  const [Des, setDes] = useState("");
  const DesHandler = (val) => {
    setDes(val);
    setValidateDes(true);
  };

  const [validateClass, setValidateClass] = useState(true);
  const [isOpenClass, setIsOpenClass] = useState(false);
  const [currentValueClass, setCurrentValueClass] = useState("");
  const [Classi, setClassi] = useState("");
  const itemsClass = [
    {
      label: "Aldult",
      value: "aldult",
      labelStyle: {
        color: "#FFCE31",
      },
    },
    {
      label: "Children",
      value: "children",
      labelStyle: {
        color: "#FFCE31",
      },
    },
  ];

  const [ActorList, setActorList] = useState([]);
  const [DirectorList, setDirectorList] = useState([]);

  const [GenreList,setGenreList] = useState([]);

  const saveHadler = async() => {
    if(currentValueMovie == ""){
      showFail();
    }
    else{
      try{
        setIndicator(true);
        const genres = JSON.stringify(GenreList).replace(/[\r\n]+/gm, '');
        const dir = JSON.stringify(DirectorList).replace(/[\r\n]+/gm, '');
        const actor = JSON.stringify(ActorList).replace(/[\r\n]+/gm, '');
        const com = JSON.stringify(mvData.production_companies).replace(/[\r\n]+/gm, '');
        const coun = JSON.stringify(mvData.production_countries).replace(/[\r\n]+/gm, '');
        const lang = JSON.stringify(mvData.spoken_languages).replace(/[\r\n]+/gm, '');
        const newData = {
          //id: mvData.id,
          adult: Classi=="Adult"?true:false,
          backdropPath: mvData.backdrop_path,
          belongsToCollection: "",
          budget: mvData.budget,
          genres: genres.toString(),
          homepage: mvData.homepage,
          imdbId: mvData.imdb_id,
          originalLanguage: mvData.original_language,
          originalTitle: mvData.original_title,
          overview: mvData.overview,
          popularity: mvData.popularity,
          posterPath: mvData.poster_path,
          productionCompanies: com.toString(),
          productionCountries: coun.toString(),
          releaseDate: mvData.release_date,
          revenue: mvData.revenue,
          runtime: mvData.runtime,
          spokenLanguages: lang.toString(),
          status: mvData.status,
          tagline: mvData.tagline,
          title: mvData.title,
          video: mvData.video,
          voteAverage: mvData.vote_average,
          voteCount: mvData.vote_count,
          casting:actor.toString(),
          directors: dir.toString()
        }
        const createdMovie =await createMovie(newData);
        console.log(createdMovie);
        setIndicator(false);
        showSuccess();
      }catch(error){
        console.log("error creating movie" + error)
        setIndicator(false);
        showFail()
      }
      
    }
  };

  const reloadHandler = () => {};

  const [mvData, setmvData] = useState();

  const viewHandler = async () => {
    const img = "https://image.tmdb.org/t/p/original";
    const mv = movieData.find(item=>item.id == currentValueMovie);
    if(mv != undefined){
      setIndicator(true);
      const moviedetail = await getMovieDetailById(mv.id)
      setmvData(moviedetail);
      //console.log(moviedetail);
      setImage(img + mv.poster_path);
      setName(mv.original_title);
      setLang(mv.original_language);
      setReDate(mv.release_date);
      setClassi(mv.adult?"Adult":"All");
      setCountry("America");
      setDes(mv.overview);
      setBudget(moviedetail.budget.toString());
      setRuntime(moviedetail.runtime.toString());
      setGenreList(moviedetail.genres);
      const dataCast =  await getCastOfMovie(mv.id);
      setActorList(dataCast.cast);
      setDirectorList([dataCast.director]);
      setIndicator(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <GenreModal visible={visibleG} hide={hideG} />
        <ActorModal visible={visibleA} hide={hideA} />
        <DirectorModal visible={visibleD} hide={hideD} />
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
        {/* <ModalConfirm
          visible={visibleC}
          hide={hideC}
          content={contentC}
          confirm={confirm}
        /> */}
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
          <Text style={styles.headerText}>New Movie</Text>
          {/* <Pressable
            style={({ pressed }) => [
              styles.resetIconStyle,
              pressed && { opacity: 0.85 },
            ]}
            onPress={reloadHandler}
          >
            <Ionicons name="reload-circle" size={38} color="#EB3223" />
          </Pressable> */}
        </View>
        <ScrollView
          style={styles.body}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
        >
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
                searchable
                searchPlaceholder="Search for movie"
                theme="DARK"
                items={itemMovie}
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
            <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={viewHandler}
          >
            <Text style={styles.saveText}>VIEW</Text>
          </Pressable>
          <View style={styles.imageContainer}>
            <Image
              style={styles.staffImage}
              source={image ? { uri: image } : placeholder}
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
          </Pressable> */}
          <ModalChooseImage
            visible={visible}
            hide={hide}
            uploadImage={uploadImage}
          />
          <Text style={styles.titleText}>Movie Information</Text>
          <View style={styles.coachInfoContainer}>
            {/* 3 textinput */}
            <Text style={styles.textLabel}>Movie Name</Text>
            <TextInput
            editable={false}
              placeholderTextColor="#a28012"
              style={
                validateName == true ? styles.textInput : styles.textInputWrong
              }
              placeholder="Enter Movie Name"
              value={Name}
              onChangeText={NameHandler}
            ></TextInput>
            {!validateName && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
          </View>

          <View>
            <Text style={styles.textLabel}>Language</Text>
            <TextInput
            editable={false}
              placeholderTextColor="#a28012"
              style={
                validateLang == true ? styles.textInput : styles.textInputWrong
              }
              placeholder="Enter Language"
              value={Lang}
              onChangeText={LangHandler}
            ></TextInput>
            {!validateLang && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}

            <Text style={styles.textLabel}>Release Date</Text>
            <TextInput
            editable={false}
              placeholderTextColor="#a28012"
              style={
                validateReDate == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Release Date"
              value={ReDate}
              onChangeText={ReDateHandler}
            ></TextInput>
            {!validateReDate && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}

            <Text style={styles.textLabel}>Budget</Text>
            <TextInput
            editable={false}
              placeholderTextColor="#a28012"
              style={
                validateBudget == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Budget"
              value={Budget}
              onChangeText={BudgetHandler}
            ></TextInput>
            {!validateBudget && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Classification</Text>
            <TextInput
            editable={false}
              placeholderTextColor="#a28012"
              style={
                validateBudget == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Classification"
              value={Classi}
              onChangeText={BudgetHandler}
            ></TextInput>
            {!validateClass && (
              <Text style={styles.validateText}>
                Please choose classification
              </Text>
            )}
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.textLabel}>Genres</Text>
              {/* <Pressable
                style={({ pressed }) => [
                  styles.addIconStyle,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={showG}
              >
                <AntDesign name="pluscircle" size={30} color="#FFCE31" />
              </Pressable> */}
            </View>
            <View style={styles.listGenre}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                // nestedScrollEnabled={true}
                horizontal={true}
                data={GenreList}
                renderItem={({ item }) => (
                  <Pressable
                    onLongPress={() => {
                      // showC();
                      // setItemid(item.id);
                    }}
                  >
                    <GenreCard item={item}></GenreCard>
                  </Pressable>
                )}
                keyExtractor={(item, index) => index}
              />
            </View>
            {/* <Text style={styles.textLabel}>Country</Text>
            <TextInput
            editable={false}
              placeholderTextColor="#a28012"
              style={
                validateCountry == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Country"
              value={Country}
              onChangeText={CountryHandler}
            ></TextInput>
            {!validateCountry && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )} */}
            <Text style={styles.textLabel}>Runtime</Text>
            <TextInput
            editable={false}
              placeholderTextColor="#a28012"
              style={
                validateRuntime == true
                  ? styles.textInput
                  : styles.textInputWrong
              }
              placeholder="Enter Runtime"
              value={Runtime}
              onChangeText={RuntimeHandler}
            ></TextInput>
            {!validateRuntime && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <Text style={styles.textLabel}>Overview</Text>
            <TextInput
            editable={false}
              placeholderTextColor="#a28012"
              style={
                validateDes == true
                  ? styles.textInputMultiline
                  : styles.textInputMultilineWrong
              }
              placeholder="Enter Overview"
              value={Des}
              multiline
              onChangeText={DesHandler}
            ></TextInput>
            {!validateDes && (
              <Text style={styles.validateText}>This field can't be empty</Text>
            )}
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.textLabel}>Directors</Text>
              {/* <Pressable
                style={({ pressed }) => [
                  styles.addIconDirectorStyle,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={showD}
              >
                <AntDesign name="pluscircle" size={30} color="#FFCE31" />
              </Pressable> */}
            </View>
            <View style={styles.listService}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                // nestedScrollEnabled={true}
                horizontal={true}
                data={DirectorList}
                renderItem={({ item }) => (
                  <Pressable
                    onLongPress={() => {
                      // showC();
                      // setItemid(item.id);
                    }}
                  >
                    <ActorCard item={item}></ActorCard>
                  </Pressable>
                )}
                keyExtractor={(item, index) => index}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.textLabel}>Actors</Text>
              {/* <Pressable
                style={({ pressed }) => [
                  styles.addIconActorStyle,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={showA}
              >
                <AntDesign name="pluscircle" size={30} color="#FFCE31" />
              </Pressable> */}
            </View>
            <View style={styles.listService}>
              <FlatList
                showsHorizontalScrollIndicator={false}
                // nestedScrollEnabled={true}
                horizontal={true}
                data={ActorList}
                renderItem={({ item }) => (
                  <Pressable
                    onLongPress={() => {
                      // showC();
                      // setItemid(item.id);
                    }}
                  >
                    <ActorCard item={item}></ActorCard>
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
    height: 200,
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
    backgroundColor: "#283663",
    fontSize: 16,
    marginEnd: 20,
    marginStart: 20,
    height: 200,
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
    marginLeft: "auto",
    marginTop: 5,
    marginRight: 20,
    zIndex: 100,
  },
  addIconActorStyle: {
    marginLeft: "auto",
    marginTop: 5,
    marginRight: 20,
    zIndex: 100,
  },
  addIconDirectorStyle: {
    marginLeft: "auto",
    marginTop: 5,
    marginRight: 20,
    zIndex: 100,
  },
  dropDownStyle: {
    paddingRight: 20,
    paddingLeft: 20,
    marginTop:10
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
