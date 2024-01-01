import { View, StyleSheet, Image, Text, Pressable } from "react-native";
import IconLabel from "../UI/IconLabel";
import {
  getCastOfMovie,
  getMovieDetailById,
  getReviewsOfMovie,
  getTrailerOfMovie,
} from "../../Services/httpService";
import { memo, useEffect, useLayoutEffect, useState } from "react";
import Loading from "../UI/Loading";

function MovieSearchItem({ movie, onPressed }) {
  const [categories, setCategories] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  function onPressHandler() {
    onPressed(movie);
  }
  useEffect(() => {
    let category = "";
    // movie.runtime= mv.runtime;
    // movie.categories=[];
    movie.categories.forEach((item, index) => {
      // movie.categories.push(item.name);
      if (index != this.length - 1) {
        category += item.name + ", ";
      }
      category += item.name;
    });
    if (category.length > 20) {
      category = category.substring(0, 20);
      category += "...";
    }
    setCategories(category);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.root,
            pressed ? styles.pressed : null,
          ]}
          onPress={onPressHandler}
        >
          <View style={styles.root}>
            <Image
              defaultSource={require("../../../icon/defaultmovie.png")}
              style={styles.image}
              source={{
                uri: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
              }}
            />
            <View style={styles.container}>
              <Text style={styles.title} numberOfLines={2}>
                {movie.title}{" "}
              </Text>
              <IconLabel
                icon="ios-star-outline"
                size={20}
                color={"orange"}
                title={movie.vote_average.toFixed(1)}
              />
              <View
                style={{
                  maxWidth: 200,
                }}
              >
                <IconLabel
                  icon="md-pricetags-outline"
                  size={20}
                  color={"white"}
                  title={categories}
                />
              </View>

              <IconLabel
                icon="calendar-outline"
                size={20}
                color={"white"}
                title={movie.release_date}
              />
              <IconLabel
                icon="time-outline"
                size={20}
                color={"white"}
                title={movie.runtime + " minutes"}
              />
            </View>
          </View>
        </Pressable>
      )}
    </>
  );
}
export default memo(MovieSearchItem);
const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 7,
  },
  image: {
    width: 110,
    height: 180,
    borderRadius: 15,
    marginEnd: 10,
    borderColor: "white",
    borderWidth: 1,
  },
  container: {
    alignItems: "flex-start",
    width: 220,
  },
  title: {
    color: "white",
    fontSize: 20.5,
    marginLeft: 5,
    marginTop: 5,
  },
  pressed: {
    opacity: 0.5,
  },
});
