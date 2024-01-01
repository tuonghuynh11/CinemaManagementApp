import { View, StyleSheet, Text } from "react-native";
import GlobalColors from "../../Color/colors";
import { Image } from "react-native";
import { addDotsToNumber } from "../../Helper/NumberHelper";
import IconButton from "../UI/IconButton";
import { AntDesign } from "@expo/vector-icons";
import { Pressable } from "react-native";
function FoodBeverageItemHistory({ item, action }) {
  return (
    <View style={styles.root}>
      <Image
        defaultSource={require("../../../icon/defaultImage.png")}
        style={styles.image}
        source={{
          uri: item.image,
        }}
        resizeMode="stretch"
      />
      <View style={{ marginTop: 5, paddingHorizontal: 5 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>{item.detail.replace(/\./g, "\n")}</Text>
        <Text style={[styles.title, { marginTop: 5, color: "yellow" }]}>
          Size: {item.servingSize}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[styles.title, { marginTop: 10 }]}>
            $ {addDotsToNumber(item.price)}
          </Text>
          <Text style={[styles.title, { marginTop: 10 }]}>
            x {item.quantitySelected}
          </Text>
        </View>
      </View>
    </View>
  );
}
export default FoodBeverageItemHistory;
const styles = StyleSheet.create({
  root: {
    // flex: 1,
    backgroundColor: GlobalColors.mainColor2,
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "space-between",
    alignItems: "center",
    width: 160,
    height: 250,
  },
  image: {
    width: 110,
    height: 80,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
    maxWidth: 140,
  },
  detail: {
    color: "white",
    fontSize: 10,
    lineHeight: 20,
    maxWidth: 140,
  },
});
