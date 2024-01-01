import { Pressable, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
function IconLabel({ icon, size, color, title, textStyle }) {
  return (
    <View style={styles.root}>
      <Ionicons name={icon} color={color} size={size} />
      <Text
        style={[styles.text, { color: color }, textStyle && textStyle]}
        numberOfLines={2}
      >
        {title}
      </Text>
    </View>
  );
}
export default IconLabel;
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
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
});
