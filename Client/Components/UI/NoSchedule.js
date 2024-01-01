import { Image, View, Text, StyleSheet } from "react-native";

function NoSchedule() {
  return (
    <View style={styles.root}>
      <Image source={require("../../../icon/movies.png")} />
      <Text style={styles.textTop} numberOfLines={2}>
        There is no schedule for this day!
      </Text>
      <Text style={styles.textBot} numberOfLines={2}>
        Please choose another day!!!
      </Text>
    </View>
  );
}
export default NoSchedule;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 100,
  },
  textTop: {
    marginTop: 10,
    width: "70%",
    color: "white",
    fontSize: 16,
    fontWeight: "semibold",
    textAlign: "center",
  },
  textBot: {
    marginTop: 20,
    width: "55%",
    fontSize: 12,
    fontWeight: "medium",
    color: "#92929D",
    textAlign: "center",
  },
});
