import { Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Keyboard,
  Modal,
  TouchableOpacity,
} from "react-native";
import SearchBox from "../../Components/UI/SearchBox";
import MovieSearchItem from "../../Components/MovieDetail/MovieSearchItem";
import {
  getMovieDetailById,
  getPopularMovies,
  getTopRatedMovies,
  searchMovies,
} from "../../Services/httpService";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import SearchError from "../../Components/UI/SearchError";
import MoviesSearchList from "../../Components/MovieDetail/MoviesSearchList";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
import Loading from "../../Components/UI/Loading";
import { useSharedValue } from "react-native-reanimated";
import { Alert } from "react-native";
import SearchBoxFilter from "../../Components/UI/SearchBoxFilter";

import GlobalColors from "../../Color/colors";
import { Pressable } from "react-native";
import { BookingContext } from "../../Store/bookingContext";
function SearchScreen({ navigation, route }) {
  console.log("SearchScreen");
  const [movies, setMovies] = useState([]);
  const [baseMovies, setBaseMovies] = useState([]);
  const [searchKeys, setSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const movieTypes = [
    "Action",
    "Animation",
    "Adventure",
    "Comedy",
    "Science Fiction",
  ];
  ///Sort
  const [movieTypeSelectedIndex, setMovieTypeSelectedIndex] = useState(0);
  const [sortSelectedIndex, setSortSelectedIndex] = useState();
  const [isSortVisible, setIsSortVisible] = useState(false);
  const sortOptions = [
    { id: 0, value: "A -> Z" },
    { id: 1, value: "Z -> A" },
    { id: 2, value: "Earliest Release" },
    { id: 3, value: "Rating" },
  ];
  const bookingCtx = useContext(BookingContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <Ionicons
          name="ios-information-circle-outline"
          size={24}
          color={"white"}
          style={{
            marginRight: 10,
          }}
        />
      ),
    });
  }, []);

  // const searchMovie = useCallback(
  //   (movies, text) => {
  //     setIsLoading(1);
  //     setMovies(movies);
  //     setSearchKey(text);
  //     setIsLoading(0);
  //     setCurrentPage(1);
  //   },
  //   [movies]
  // );

  async function searchMovie(text) {
    if (text.trim() === "") {
      Alert.alert("Warning", "You need to enter a movie name");
      return;
    }
    setSearchKey(text);
    try {
      Keyboard.dismiss();
      setIsLoading(1);
      await searchMovies(text)
        .then((response) => {
          setMovies(response.movies);
          setBaseMovies(response.movies);
          setTotalPage(response.totalPage);
        })
        .catch((error) => {
          console.log(error);
        });
      sortHandler(sortSelectedIndex);
      setIsLoading(0);
    } catch (error) {
      console.log(error);
      setIsLoading(0);
    }
  }
  useEffect(() => {
    async function searchHandler(searchMovieName) {
      try {
        setIsLoading(1);

        await searchMovies(searchMovieName).then((response) => {
          // console.log(response);
          // const movieWrapper = response.map((item) => {
          //   return new Movie(
          //     item?.id,
          //     item?.title,
          //     item?.overview,
          //     null,
          //     item?.vote_average,
          //     item?.poster_path,
          //     item?.release_date,
          //     [...item?.genre_ids]
          //   );
          // });
          setMovies(response.movies);
          setBaseMovies(response.movies);
          setTotalPage(response.totalPage);
          setIsLoading(0);
        });
      } catch (error) {
        console.log(error);
        setIsLoading(0);
      }
      // await searchMovies(searchMovieName).then((response) => {
      //   setIsLoading(0);
      //   console.log(response);
      //   setMovies(response);
      // });
    }
    if (route !== null) {
      if (route?.params?.searchKey) {
        setSearchKey(route.params.searchKey);
        searchHandler(route.params.searchKey);
        return;
      }
    }
    console.log("SearchingKey");
    searchHandler("Avengers");
    // setSearchKey("Avengers");
  }, [route?.params?.searchKey]);

  async function onLoadMoreHandler() {
    console.log("onLoadMoreHandler");

    console.log("total page", totalPage);
    console.log("currentPage", currentPage);

    if (currentPage + 1 > totalPage) {
      return;
    }
    setCurrentPage((currentPage) => currentPage + 1);
    console.log("moviename", searchKeys);

    async function searchHandler(searchMovieName, currentPage) {
      try {
        await searchMovies(searchMovieName, currentPage).then((response) => {
          setMovies((curr) => movies.concat(response.movies));
          setBaseMovies((curr) => curr.concat(response.movies));
        });
      } catch (error) {
        console.log(error);
      }
    }
    await searchHandler(searchKeys, currentPage + 1);
  }

  function sortByMovieType(typeIndex) {
    const movieTypes = [
      "Action",
      "Animation",
      "Adventure",
      "Comedy",
      "Science Fiction",
    ];
    // console.log(movies[0].categories);

    //Get movie list by movie type
    if (typeIndex !== 5) {
      setMovies((curr) =>
        baseMovies.filter((movie) =>
          movie.categories.some(
            (category) => category.name === movieTypes[typeIndex]
          )
        )
      );
    } else {
      setMovies((curr) => [...baseMovies]);
    }
  }

  function Separator() {
    return (
      <View
        style={{
          width: "100%",
          height: 2,
          borderBottomColor: "white",
          borderBottomWidth: 0.3,
        }}
      ></View>
    );
  }
  function SortItem({ item, isChecked, onSelect }) {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            margin: 10,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: 10,
          },
          pressed && { opacity: 0.6 },
          isChecked && { borderWidth: 2, borderColor: GlobalColors.button },
        ]}
        onPress={onSelect}
      >
        <Text
          style={[
            { color: "white", fontWeight: "bold", fontSize: 16 },
            isChecked && { fontWeight: "normal" },
          ]}
        >
          {item.value}
        </Text>
        {isChecked && (
          <Ionicons
            name="ios-checkmark"
            size={24}
            color={GlobalColors.button}
          />
        )}
      </Pressable>
    );
  }
  function sortHandler(option) {
    //0 : A -> Z
    //1: Z -> A

    //2: Release Date
    //3 : Price decrease
    switch (option) {
      case 0:
        setMovies((curr) =>
          curr.sort((movie1, movie2) => {
            var nameA = movie1.title.toUpperCase(); // Convert names to uppercase
            var nameB = movie2.title.toUpperCase();

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0; // Names are equal
          })
        );
        break;
      case 1:
        setMovies((curr) =>
          curr.sort((movie1, movie2) => {
            var nameA = movie1.title.toUpperCase(); // Convert names to uppercase
            var nameB = movie2.title.toUpperCase();

            if (nameA > nameB) {
              return -1;
            }
            if (nameA < nameB) {
              return 1;
            }
            return 0; // Names are equal
          })
        );
        break;
      case 2:
        setMovies((curr) =>
          curr.sort(
            (movie1, movie2) =>
              new Date(movie2.release_date) - new Date(movie1.release_date)
          )
        );
        break;
      case 3:
        setMovies((curr) =>
          curr.sort(
            (movie1, movie2) =>
              new Date(movie2.vote_average) - new Date(movie1.vote_average)
          )
        );
        break;
      default:
        break;
    }
  }
  function onClickMovieHandler(movieDetail) {
    bookingCtx.setCurrentMovie(movieDetail);
  }
  return (
    <>
      <Modal
        visible={isSortVisible}
        backdropOpacity={0.7}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            backgroundColor: "'rgba(0,0,0,0.5)'",
            borderRadius: 30,
            width: 350,
            zIndex: 1,
            width: "100%",
            flex: 1,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "#0F193E",
              paddingVertical: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <View
              style={{
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                borderBottomColor: "white",
                borderBottomWidth: 0.3,
                paddingBottom: 10,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Sort By
              </Text>
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  marginTop: -30,
                  marginRight: 10,
                }}
                onPress={() => setIsSortVisible((curr) => !curr)}
              >
                <Ionicons name="close-circle-outline" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <SortItem
              item={sortOptions[0]}
              isChecked={sortSelectedIndex === 0}
              onSelect={() => {
                setSortSelectedIndex(0);
                setIsSortVisible((curr) => !curr);
                sortHandler(0);
              }}
            />
            <Separator />
            <SortItem
              item={sortOptions[1]}
              isChecked={sortSelectedIndex === 1}
              onSelect={() => {
                setSortSelectedIndex(1);
                setIsSortVisible((curr) => !curr);
                sortHandler(1);
              }}
            />
            <Separator />
            <SortItem
              item={sortOptions[2]}
              isChecked={sortSelectedIndex === 2}
              onSelect={() => {
                setSortSelectedIndex(2);
                setIsSortVisible((curr) => !curr);
                sortHandler(2);
              }}
            />
            <Separator />
            <SortItem
              item={sortOptions[3]}
              isChecked={sortSelectedIndex === 3}
              onSelect={() => {
                setSortSelectedIndex(3);
                setIsSortVisible((curr) => !curr);
                sortHandler(3);
              }}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.root}>
        <SearchBoxFilter
          searchFunc={searchMovie}
          initValue={searchKeys}
          filterHandler={() => setIsSortVisible((curr) => !curr)}
        />
        <View style={{ marginTop: 20 }}>
          <FlatList
            data={movieTypes}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            renderItem={(itemData) => {
              return (
                <Pressable
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        itemData.index == movieTypeSelectedIndex
                          ? GlobalColors.mainColor1
                          : GlobalColors.lightBackground,
                      width: 120,
                    },
                    pressed && { opacity: 0.5 },
                  ]}
                  onPress={() => {
                    if (movieTypeSelectedIndex === itemData.index) {
                      setMovieTypeSelectedIndex(null);
                      sortByMovieType(5);
                    } else {
                      setMovieTypeSelectedIndex(itemData.index);
                      sortByMovieType(itemData.index);
                    }
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {itemData.item}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        <View style={styles.container}>
          {/* {movies ? <MoviesSearchList data={movies} /> : <SearchError />} */}
          {isLoading === 1 ? (
            <View style={{ height: "100%" }}>
              <Loading message="Please wait....." />
            </View>
          ) : movies.length === 0 ? (
            <View style={{ height: "100%" }}>
              <SearchError />
            </View>
          ) : (
            <View>
              <MoviesSearchList
                data={movies}
                navigations={navigation}
                handleLoadMore={onLoadMoreHandler}
                onClickMovieHandler={onClickMovieHandler}
              />
            </View>
          )}
        </View>
      </View>
    </>
  );
  // return <Text>Search Screen</Text>;
}
export default SearchScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },
  container: {
    padding: 10,
    marginBottom: 180,
  },
});
