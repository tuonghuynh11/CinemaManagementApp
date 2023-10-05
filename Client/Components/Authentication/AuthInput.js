import { Text, TextInput, View, StyleSheet } from "react-native";

function AuthInput({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  placeholder,
  message,
}) {
  return (
    <View style={styles.root}>
      <Text style={[styles.label]}>{label}</Text>
      <View style={[styles.inputContainer, , isInvalid && styles.invalidInput]}>
        <TextInput
          style={styles.textInput}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onUpdateValue}
          secureTextEntry={secure}
          placeholder={placeholder}
        />
      </View>
      {isInvalid && <Text style={styles.invalidLabel}>*{message}</Text>}
    </View>
  );
}
export default AuthInput;

const styles = StyleSheet.create({
  root: {
    marginTop: 10,
  },
  label: {
    color: "black",
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "700",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
  },
  textInput: {
    color: "black",
    fontSize: 17,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  invalidLabel: {
    color: "#FF4E00",
  },
  invalidInput: {
    borderColor: "#FF4E00",
  },
});
