import { Image, Text, View, StyleSheet, Pressable } from "react-native";
import GlobalColors from "../../Color/colors";

function MovieItem({
  index,
  imageUri,
  onPressed,
  isTop = 1,
  style,
  rootStyle,
  date,
}) {
  const BASE_IMAGE_URI = "https://image.tmdb.org/t/p/w500" + imageUri;
  let number = <></>;
  if (isTop === 1) {
    number = (
      <View style={styles.numberView}>
        <Text style={styles.number}> {index + 1} </Text>
      </View>
    );
  }
  return (
    <Pressable
      style={({ pressed }) => [
        styles.root,
        rootStyle ? rootStyle : null,
        pressed ? styles.pressed : null,
      ]}
      onPress={onPressed}
    >
      <View>
        <View>
          <Image
            defaultSource={require("../../../icon/defaultmovie.png")}
            style={[styles.image, style ? style : null]}
            source={{ uri: BASE_IMAGE_URI }}
          />
        </View>
        {number}
        {date && (
          <View
            style={{
              backgroundColor: "black",
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
            }}
          >
            <Text style={{ color: "white", textAlign: "center", fontSize: 12 }}>
              {date}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default MovieItem;
const styles = StyleSheet.create({
  root: {
    height: 220,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: -100,
  },
  image: {
    width: 150,
    height: 220,
    borderRadius: 15,
  },
  number: {
    fontSize: 96,
    color: GlobalColors.number,
    borderColor: GlobalColors.numberStoke,
    fontWeight: "semibold",
  },
  numberView: {
    position: "relative",
    marginTop: -75,
    marginLeft: -37,
  },
  pressed: {
    opacity: 0.5,
  },
});
