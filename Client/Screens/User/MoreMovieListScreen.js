import { SafeAreaView } from "react-native";
import { FlatList } from "react-native";
import { Text } from "react-native";
import { View, StyleSheet } from "react-native";
import MovieItem from "../../Components/MovieDetail/MovieItem";
import { useEffect, useState } from "react";
import {
  getMovieDetailById,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendMovie,
  getUpcomingMovies,
} from "../../Services/httpService";
import IconButton from "../../Components/UI/IconButton";
import Loading from "../../Components/UI/Loading";

function MoreMovieListScreen({ navigation, route }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchTrendMovies() {
      setIsLoading(true);
      try {
        let moviess = [];
        if (route?.params?.type === "trending") {
          moviess = await getTrendMovie();
        } else if (route?.params?.type === "Popular") {
          moviess = await getPopularMovies();
        } else if (route?.params?.type === "Now Playing") {
          moviess = await getNowPlayingMovies();
        } else if (route?.params?.type === "Top Rated") {
          moviess = await getTopRatedMovies();
        } else {
          moviess = await getUpcomingMovies();
        }
        if (moviess) {
          if (moviess.length !== movies.length) {
            setMovies(moviess);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }

    fetchTrendMovies();
  }, [movies]);
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

        navigation.navigate("MovieDetailScreen", {
          movieDetail: movieDetail,
          reviews: null,
          casts: null,
          youtubeKey: null,
          isWatchList: false,
        });
      } catch (error) {
        console.log(error);
      }
      // setIsLoading(false);
    }
    console.log(itemData.item);
    return (
      <View style={{ alignItems: "center" }}>
        <MovieItem
          imageUri={itemData.item.poster_path}
          index={itemData.index}
          onPressed={movieHandler}
          isTop={0}
          style={{
            width: 100,
            height: 160,
            marginBottom: 0,
          }}
          rootStyle={{
            width: 100,
            height: 160,
            marginBottom: 0,
            margin: 10,
          }}
        />
        <Text
          style={{
            maxWidth: 100,
            color: "white",
            marginTop: 10,
            textAlign: "center",
          }}
          numberOfLines={2}
        >
          {itemData.item.title}
        </Text>
      </View>
    );
  }
  return (
    <>
      <SafeAreaView style={styles.root}>
        <View style={styles.root}>
          <View style={{ alignSelf: "flex-start", zIndex: 1 }}>
            <IconButton
              icon={"chevron-back-outline"}
              color={"white"}
              size={30}
              onPress={() => navigation.goBack()}
            />
          </View>

          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              alignSelf: "center",
              textAlign: "center",
              width: "100%",
              marginTop: -30,
              paddingBottom: 20,
            }}
          >
            {route?.params?.type} Movies
          </Text>
          {isLoading && (
            <View style={{ flex: 1 }}>
              <Loading message={"Loading..."} />
            </View>
          )}
          {!isLoading && (
            <View style={styles.moviesList}>
              <FlatList
                keyExtractor={(item) => item.id}
                data={movies}
                renderItem={renderMovieItem}
                showsHorizontalScrollIndicator={false}
                numColumns={3}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
export default MoreMovieListScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  moviesList: {
    // padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
});
