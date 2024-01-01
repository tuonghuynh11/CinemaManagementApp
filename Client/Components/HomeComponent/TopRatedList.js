import { useContext, useEffect, useState } from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import {
  getCastOfMovie,
  getMovieDetailById,
  getMovieWatchList,
  getNowPlayingMovies,
  getReviewsOfMovie,
  getTopRatedMovies,
  getTrailerOfMovie,
} from "../../Services/httpService";
import MovieItem from "../MovieDetail/MovieItem";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../Store/authContext";
import { fetchWatchList } from "../../Util/firebase";

function TopRatedList() {
  const navigation = useNavigation();
  const [topRatedMovies, setTopRatedMovies] = useState([]);

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
    async function fetchTopRatedMovies() {
      const movies = await getTopRatedMovies();
      setTopRatedMovies(movies);
    }
    fetchTopRatedMovies();
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
      data={topRatedMovies}
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
        />
      )}
    />
  );
}
export default TopRatedList;
const styles = StyleSheet.create({
  moviesListNew: {
    alignSelf: "center",
  },
});
