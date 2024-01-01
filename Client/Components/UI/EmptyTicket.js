import { Image, View, Text, StyleSheet } from "react-native";
function EmptyTicket() {
  return (
    <View style={styles.root}>
      <Image source={require("../../../icon/movies.png")} />
      <Text style={styles.textTop} numberOfLines={2}>
        There is No Ticket Yet !
      </Text>
      <Text style={styles.textBot} numberOfLines={2}>
        Choose a movie and book a ticket now!!!
      </Text>
    </View>
  );
}

export default EmptyTicket;
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
    width: "50%",
    color: "white",
    fontSize: 16,
    fontWeight: "semibold",
    textAlign: "center",
  },
  textBot: {
    marginTop: 20,
    width: "50%",
    fontSize: 12,
    fontWeight: "medium",
    color: "#92929D",
    textAlign: "center",
  },
});
