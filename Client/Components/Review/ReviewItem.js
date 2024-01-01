import { Image, Text } from "react-native";
import { View, StyleSheet } from "react-native";
import GlobalColors from "../../Color/colors";
function ReviewItem({ review }) {
  return (
    <View style={styles.root}>
      <View style={styles.containerInfo}>
        <Image
          style={styles.image}
          defaultSource={require("../../../icon/default_avatar.png")}
          source={{
            uri: "https://image.tmdb.org/t/p/w500" + review.avatar_path,
          }}
        />
        <Text style={styles.rating}>{review.rating}</Text>
      </View>
      <View style={styles.containerContent}>
        <Text style={styles.useNameStyle}>{review.username}</Text>
        <Text style={styles.content}>{review.content}</Text>
      </View>
    </View>
  );
}
export default ReviewItem;
const styles = StyleSheet.create({
  root: {
    width: "86%",
    flexDirection: "row",
    padding: 10,
  },
  containerInfo: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingRight: 10,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  rating: {
    color: GlobalColors.icon_active,
    fontSize: 14,
    marginTop: 10,
  },
  containerContent: {},
  useNameStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    fontSize: 12,
    color: "white",
    textAlign: "auto",
  },
});
