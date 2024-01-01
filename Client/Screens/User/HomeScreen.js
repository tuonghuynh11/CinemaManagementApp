import {
  View,
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import SearchBox from "../../Components/UI/SearchBox";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  getCastOfMovie,
  getMovieDetailById,
  getMovieWatchList,
  getNowPlayingMovies,
  getPopularMovies,
  getReviewsOfMovie,
  getTopRatedMovies,
  getTrailerOfMovie,
  getTrendMovie,
  getUpcomingMovies,
} from "../../Services/httpService";
import MovieItem from "../../Components/MovieDetail/MovieItem";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import GlobalColors from "../../Color/colors";
import Loading from "../../Components/UI/Loading";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
import NowPlayingList from "../../Components/HomeComponent/NowPlayingList";
import UpcomingList from "../../Components/HomeComponent/UpcomingList";
import TopRatedList from "../../Components/HomeComponent/TopRatedList";
import PopularList from "../../Components/HomeComponent/PopularList";
import BookSeatScreen from "./BookSeatScreen";
import { AuthContext } from "../../Store/authContext";
import { fetchWatchList } from "../../Util/firebase";
import { LogBox } from "react-native";
import { Image } from "react-native";
import FlatButton from "../../Components/UI/FlatButton";
import { Dimensions } from "react-native";
import { BookingContext } from "../../Store/bookingContext";
LogBox.ignoreLogs(["Sending"]);
const Tab = createMaterialTopTabNavigator();
function HomeScreen({ navigation, route }) {
  const [watchList, setWatchList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);

  const authCtx = useContext(AuthContext);
  const bookingCtx = useContext(BookingContext);

  const panels = [
    <Image style={styles.panel} source={require("../../../icon/panel1.jpg")} />,
    <Image style={styles.panel} source={require("../../../icon/panel2.jpg")} />,
    <Image style={styles.panel} source={require("../../../icon/panel3.jpg")} />,
    <Image style={styles.panel} source={require("../../../icon/panel4.jpg")} />,
  ];
  useEffect(() => {
    console.log("WatchListHomeScreen");
    async function getWatchList() {
      try {
        // const watchLists = await getMovieWatchList();
        const watchLists = await fetchWatchList(authCtx.uid);
        setWatchList(watchLists);
      } catch (error) {}
    }
    getWatchList();
  }, [navigation]);
  function isInWatchList(movieId) {
    if (watchList.length > 0) {
      return watchList.find((movie) => {
        return movie.id === movieId;
      })
        ? true
        : false;
    }
    console.log(0);

    return false;
  }
  useEffect(() => {
    console.log("UpcomingMoviesHomeScreen");

    async function fetchUpcomingMovies() {
      try {
        const movies = await getTrendMovie();
        if (movies) {
          if (movies.length !== trendingMovies.length) {
            setTrendingMovies(movies);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUpcomingMovies();
  }, []);
  function renderMovieItem(itemData) {
    async function movieHandler() {
      console.log("click");
      // setIsLoading(true);
      try {
        const movieDetail = await getMovieDetailById(itemData.item.id)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            //console.log(error);
            return null;
          });
        if (!movieDetail) {
          throw new Error("Connection error");
        }
        bookingCtx.setCurrentMovie(movieDetail);
        navigation.navigate("MovieDetailScreen", {
          movieDetail: movieDetail,
          reviews: null,
          casts: null,
          youtubeKey: null,
          isWatchList: isInWatchList(itemData.item.id),
        });
      } catch (error) {
        console.log(error);
      }
      // setIsLoading(false);
    }
    return (
      <MovieItem
        imageUri={itemData.item.poster_path}
        index={itemData.index}
        isTop={1}
        onPressed={movieHandler}
      />
    );
  }
  async function searchHandler(textInput) {
    navigation.navigate("SearchScreen", {
      searchKey: textInput,
    });
    // navigation.navigate("searchHomeScreen", {
    //   searchKey: textInput,
    // });
  }

  function seeMoreMovie(type) {
    navigation.navigate("MoreMovieListScreen", {
      type: type,
    });
  }
  return isLoading ? (
    <Loading />
  ) : (
    <SafeAreaView style={styles.root}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 0,
        }}
      >
        <Image
          style={styles.image}
          source={require("../../../assets/logo2.png")}
        />
        <Text
          style={[
            styles.title,
            {
              alignSelf: "center",
              marginTop: 20,
              color: GlobalColors.mainColor1,
            },
          ]}
        >
          Master Cinemas
        </Text>
      </View>

      <ScrollView horizontal={false} style={{ marginBottom: 68 }}>
        <View style={[styles.container, { height: 600, flex: 1 }]}>
          {/* <Text style={styles.title}>What do you want to watch?</Text> */}

          <SearchBox
            pagingEnabled={true}
            searchFunc={searchHandler}
            navigationParent={route?.params?.navigationParent}
          />
          <FlatList
            horizontal
            data={panels}
            pagingEnabled
            style={{ width: device.width - 20, marginTop: 10 }}
            renderItem={(itemData) => {
              return itemData.item;
            }}
          ></FlatList>
          <Text
            style={[
              styles.listTitle,
              {
                marginTop: -110,
                marginBottom: -10,
                color: "#ee2222",
              },
            ]}
          >
            Trending{" "}
          </Text>

          <FlatList
            style={styles.moviesList}
            horizontal
            keyExtractor={(item) => item.id}
            data={trendingMovies}
            renderItem={renderMovieItem}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <View style={[styles.movieListContainer, { marginTop: -10 }]}>
          <Text style={styles.listTitle}>Coming Soon </Text>
          <View style={{ alignSelf: "flex-end", marginTop: -20 }}>
            <FlatButton
              color={"white"}
              onPress={() => seeMoreMovie("Upcoming")}
            >
              <Text>See more {">"}</Text>
            </FlatButton>
          </View>
          <UpcomingList />
        </View>
        <View style={[styles.movieListContainer]}>
          <Text style={styles.listTitle}>Now Playing </Text>
          <View style={{ alignSelf: "flex-end", marginTop: -20 }}>
            <FlatButton
              color={"white"}
              onPress={() => seeMoreMovie("Now Playing")}
            >
              <Text>See more {">"}</Text>
            </FlatButton>
          </View>
          <NowPlayingList />
        </View>

        <View style={[styles.movieListContainer]}>
          <Text style={styles.listTitle}>Top Rated </Text>
          <View style={{ alignSelf: "flex-end", marginTop: -20 }}>
            <FlatButton
              color={"white"}
              onPress={() => seeMoreMovie("Top Rated")}
            >
              <Text>See more {">"}</Text>
            </FlatButton>
          </View>
          <TopRatedList />
        </View>
        <View style={[styles.movieListContainer]}>
          <Text style={styles.listTitle}>Popular </Text>
          <View style={{ alignSelf: "flex-end", marginTop: -20 }}>
            <FlatButton color={"white"} onPress={() => seeMoreMovie("Popular")}>
              <Text>See more {">"}</Text>
            </FlatButton>
          </View>
          <PopularList />
        </View>
        {/* <View style={styles.navigateContainer}>
          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: {
                fontSize: 10,
              },
              tabBarAllowFontScaling: true,
              tabBarInactiveTintColor: "#c8c0c0",
              tabBarActiveTintColor: GlobalColors.icon_active,
              lazy: true,
              lazyPreloadDistance: 2,
            }}
          >
            <Tab.Screen
              name="NowPlaying"
              component={NowPlayingList}
              initialParams={{ watchList: watchList }}
            />
            <Tab.Screen name="Upcoming" component={UpcomingList} />
            <Tab.Screen name="Top Rated" component={TopRatedList} />
            <Tab.Screen name="Popular" component={PopularList} />
          </Tab.Navigator>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
export default HomeScreen;
const device = Dimensions.get("window");
const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: GlobalColors.background,
    shadowColor: GlobalColors.background,
  },
  container: {
    flex: 1.1,
    padding: 10,
  },
  navigateContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    marginTop: -100,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
    marginBottom: 20,
  },
  listTitle: {
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
  },
  moviesList: {
    paddingHorizontal: 5,
    paddingTop: 40,
  },
  moviesListNew: {
    alignSelf: "center",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    height: 50,
    width: 70,
  },
  movieListContainer: {
    margin: 10,
  },
  panel: {
    width: device.width - 20,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: GlobalColors.validate,
    borderWidth: 0.5,
  },
});
