import { Pressable, StyleSheet, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
function IconLabelV2({ icon, size, color, title, textStyle }) {
  return (
    <View style={styles.root}>
      <MaterialCommunityIcons name={icon} color={color} size={size} />
      <Text
        style={[styles.text, { color: color }, textStyle && textStyle]}
        numberOfLines={2}
      >
        {title}
      </Text>
    </View>
  );
}
export default IconLabelV2;
const styles = StyleSheet.create({
  root: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    color: "white",
    marginStart: 5,
  },
});
