import { View, StyleSheet, Text } from "react-native";
import GlobalColors from "../../Color/colors";
import { Image } from "react-native";
import { addDotsToNumber } from "../../Helper/NumberHelper";
import IconButton from "../UI/IconButton";
import { AntDesign } from "@expo/vector-icons";
import { Pressable } from "react-native";
function FoodBeverageItem({ item, action }) {
  return (
    <View style={styles.root}>
      <Image
        defaultSource={require("../../../icon/defaultImage.png")}
        style={styles.image}
        source={{
          uri: item.image,
        }}
      />
      <View style={{ marginLeft: 0 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>{item.detail.replace(/\./g, "\n")}</Text>
        <Text style={[styles.title, { marginTop: 5, color: "yellow" }]}>
          Size: {item.servingSize}
        </Text>
        <Text style={[styles.title, { marginTop: 10, color: "red" }]}>
          $ {addDotsToNumber(item.price)}
        </Text>
      </View>
      <View style={{ alignItems: "center", gap: 10, marginRight: 10 }}>
        <Pressable
          style={({ pressed }) => [pressed && { opacity: 0.5 }]}
          onPress={() => action("plus")}
        >
          <AntDesign name="pluscircle" size={24} color="#0c6b28" />
        </Pressable>
        <Text style={{ color: "#484C4F", fontWeight: "bold", fontSize: 20 }}>
          {item.quantitySelected}
        </Text>
        <Pressable
          style={({ pressed }) => [pressed && { opacity: 0.5 }]}
          onPress={() => action("minus")}
        >
          <AntDesign name="minuscircle" size={24} color="#A1A1A1" />
        </Pressable>
      </View>
    </View>
  );
}
export default FoodBeverageItem;
const styles = StyleSheet.create({
  root: {
    // flex: 1,
    backgroundColor: GlobalColors.mainColor2,
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: 90,
    height: 90,
    marginRight: 10,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    width: 185,
  },
  detail: {
    color: "white",
    fontSize: 14,
    lineHeight: 20,
    width: 190,
  },
});
