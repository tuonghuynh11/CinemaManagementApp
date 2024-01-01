import { View, StyleSheet } from "react-native";
import GlobalColors from "../../Color/colors";
import { Image } from "react-native";
import { Text } from "react-native";
import { addDotsToNumber } from "../../Helper/NumberHelper";
import { Pressable } from "react-native";
import { covertDateTimeToString } from "../../Helper/DateTime";
function HistoryTicketItem({
  image,
  title,
  runtime,
  category,
  price,
  onPress,
}) {
  function addDotsToNumbers(number) {
    if (number.toString() === "0") return "0";
    if (number) {
      number = number.toFixed(2);
    }
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return (
    <Pressable
      style={({ pressed }) => [styles.root, pressed && { opacity: 0.6 }]}
      onPress={onPress}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          defaultSource={require("../../../icon/defaultmovie.png")}
          style={styles.image}
          source={{
            uri: "https:/image.tmdb.org/t/p/w500" + image,
          }}
        />
        <View style={styles.textBody}>
          <Text style={[styles.title, { marginBottom: 10, maxWidth: 200 }]}>
            {title}
          </Text>
          <Text style={styles.text}>Runtime: {runtime} minutes</Text>
          <Text style={[styles.text, { maxWidth: 200 }]}>
            Category: {category}
          </Text>
        </View>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.title}>${addDotsToNumbers(price)}</Text>
        <Text style={styles.title}></Text>
      </View>
    </Pressable>
  );
}
export default HistoryTicketItem;

const styles = StyleSheet.create({
  root: {
    backgroundColor: GlobalColors.lightBackground,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  image: {
    width: 90,
    height: 110,
    borderRadius: 10,
  },
  textBody: {
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  text: {
    fontSize: 13,
    color: "white",
  },
});
