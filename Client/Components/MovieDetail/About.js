import { useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text } from "react-native";

function About({ overview, route }) {
  return (
    <ScrollView style={styles.root}>
      <Text style={styles.text}>{route?.params?.movie?.overview}</Text>
    </ScrollView>
  );
}
export default About;
const styles = StyleSheet.create({
  root: {
    padding: 10,
  },
  text: {
    fontSize: 15,
    color: "white",
    marginRight: 5,
    fontWeight: "400",
    textAlign: "justify",
  },
});
