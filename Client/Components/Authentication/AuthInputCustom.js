import { Text, TextInput, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import GlobalColors from "../../Color/colors";
function AuthInputCustom({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  placeholder,
  message,
  isDisabled,
}) {
  const [showPassword, setShowPassword] = useState(secure);
  return (
    <View style={styles.root}>
      <Text style={[styles.label]}>{label}</Text>
      <View style={[styles.inputContainer, , isInvalid && styles.invalidInput]}>
        <TextInput
          style={styles.textInput}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onUpdateValue}
          secureTextEntry={showPassword}
          placeholder={placeholder}
          editable={!isDisabled}
          placeholderTextColor="#f3ebeb8e"
        />
        {secure && (
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={{ marginRight: 10 }}
            onPress={() => setShowPassword(!showPassword)}
            disabled={isDisabled}
          />
        )}
      </View>
      {isInvalid && <Text style={styles.invalidLabel}>*{message}</Text>}
    </View>
  );
}
export default AuthInputCustom;

const styles = StyleSheet.create({
  root: {
    marginTop: 10,
  },
  label: {
    color: "white",
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "700",
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: GlobalColors.mainColor2,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInput: {
    color: "white",
    fontSize: 17,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flex: 1,
  },
  invalidLabel: {
    color: "#FF4E00",
  },
  invalidInput: {
    borderColor: "#FF4E00",
  },
});
