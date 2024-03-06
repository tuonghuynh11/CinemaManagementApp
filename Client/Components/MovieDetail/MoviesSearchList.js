import { ActivityIndicator, FlatList } from "react-native";
import MovieSearchItem from "./MovieSearchItem";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  getCastOfMovie,
  getMovieWatchList,
  getReviewsOfMovie,
  getTrailerOfMovie,
} from "../../Services/httpService";
import { AuthContext } from "../../Store/authContext";
import { fetchWatchList } from "../../Util/firebase";
import { View, StyleSheet } from "react-native";
import { BookingContext } from "../../Store/bookingContext";

function MoviesSearchList({
  data,
  navigations,
  isWatchList = false,
  isLoading,
  handleLoadMore,
  onClickMovieHandler,
}) {
  const [watchList, setWatchList] = useState([]);
  const authCtx = useContext(AuthContext);
  console.log("MoviesSearchList");
  useEffect(() => {
    async function getWatchList() {
      try {
        // const watchLists = await getMovieWatchList();
        const watchLists = await fetchWatchList(authCtx.uid);
        setWatchList(watchLists);
      } catch (error) {}
    }
    getWatchList();
  }, []);

  function isInWatchList(movieId) {
    if (watchList.length > 0) {
      return watchList.find((movie) => {
        return movie.id === movieId;
      })
        ? true
        : false;
    }
  }
  // const navigation = useNavigation();
  // console.log(navigations.getParent("search"));
  const navigation = navigations;
  async function movieDetailHandler(movieDetail) {
    let navigateName = "";
    // console.log("movieDetail", movieDetail);
    // return;
    async function getDatas() {
      onClickMovieHandler(movieDetail);
      navigation.navigate("MovieDetailScreen", {
        movieDetail: movieDetail,
        reviews: null,
        casts: null,
        youtubeKey: null,
        isWatchList: isWatchList ? true : isInWatchList(movieDetail.id),
      });
    }
    await getDatas();

    // navigation.navigate(navigateName, {
    //   movieDetail: movieDetail,
    //   reviews: reviews,
    //   casts: casts,
    //   youtubeKey: youtubeKey,
    //   isWatchList: isWatchList ? true : isInWatchList(movieDetail.id),
    // });
  }
  // function renderMovie(itemData) {
  //   return (
  //     <MovieSearchItem movie={itemData.item} onPressed={movieDetailHandler} />
  //   );
  // }
  const renderMovie = useCallback(
    (itemData) => (
      <MovieSearchItem movie={itemData.item} onPressed={movieDetailHandler} />
    ),
    []
  );
  function renderFooter() {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
  }

  return (
    <FlatList
      initialNumToRender={10}
      keyExtractor={(item, index) => index.toString()}
      data={data}
      renderItem={renderMovie}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0}
      onEndReached={handleLoadMore}
      maxToRenderPerBatch={5}
    />
  );
}
export default MoviesSearchList;
const styles = StyleSheet.create({
  loader: {
    marginTop: 20,
    alignItems: "center",
  },
});
