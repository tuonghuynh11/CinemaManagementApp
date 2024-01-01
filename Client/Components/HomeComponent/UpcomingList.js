import { useContext, useEffect, useState } from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import {
  getCastOfMovie,
  getMovieDetailById,
  getMovieWatchList,
  getNowPlayingMovies,
  getReviewsOfMovie,
  getTrailerOfMovie,
  getUpcomingMovies,
} from "../../Services/httpService";
import MovieItem from "../MovieDetail/MovieItem";
import { useNavigation } from "@react-navigation/native";
import { fetchWatchList } from "../../Util/firebase";
import { AuthContext } from "../../Store/authContext";

function UpcomingList() {
  const navigation = useNavigation();
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  const [watchList, setWatchList] = useState([]);
  const authCtx = useContext(AuthContext);

  // useEffect(() => {
  //   async function getWatchList() {
  //     try {
  //       const watchLists = await getMovieWatchList();
  //       setWatchList(watchLists);
  //     } catch (error) {}
  //   }
  //   getWatchList();
  // }, [watchList]);
  useEffect(() => {
    async function fetchUpcomingMovies() {
      try {
        const movies = await getUpcomingMovies();
        if (movies) {
          if (movies.length !== upcomingMovies.length) {
            setUpcomingMovies(movies);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUpcomingMovies();
  }, []);

  // function isInWatchList(movieId) {
  //   if (watchList.length > 0) {
  //     return watchList.find((movie) => {
  //       return movie.id === movieId;
  //     })
  //       ? true
  //       : false;
  //   }
  // }

  async function movieHandler(movieID) {
    console.log("click");
    try {
      const movieDetail = await getMovieDetailById(movieID)
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
  }
  return (
    <FlatList
      style={styles.moviesListNew}
      data={upcomingMovies}
      horizontal
      showsHorizontalScrollIndicator={false}
      initialNumToRender={15}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <MovieItem
          onPressed={movieHandler.bind(this, itemData.item.id)}
          imageUri={itemData.item.poster_path}
          index={itemData.index}
          isTop={0}
          style={{
            width: 120,
            height: 180,
            marginBottom: 0,
          }}
          rootStyle={{
            width: 120,
            height: 180,
            marginBottom: 0,
            margin: 10,
          }}
          date={itemData.item.release_date}
        />
      )}
      // numColumns="3"
    />
  );
}
export default UpcomingList;
const styles = StyleSheet.create({
  moviesListNew: {
    alignSelf: "center",
  },
});
