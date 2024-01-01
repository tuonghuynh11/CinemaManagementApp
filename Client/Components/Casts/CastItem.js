import { Image, View, Text, StyleSheet } from "react-native";

function CastItem({ cast }) {
  return (
    <View style={styles.root}>
      <Image
        style={styles.image}
        defaultSource={require("../../../icon/default_avatar.png")}
        source={{
          uri: "https://image.tmdb.org/t/p/w500" + cast.profile_path,
        }}
      />
      <Text style={styles.title}>{cast.name}</Text>
    </View>
  );
}
export default CastItem;
const styles = StyleSheet.create({
  root: {
    width: "50%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    height: 70,
    width: 70,
    borderRadius: 45,
  },
  title: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
    textAlign: "auto",
    paddingTop: 10,
  },
});
