import { TextInput, View, StyleSheet, Alert, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./IconButton";
import { useEffect, useState } from "react";
import { searchMovies } from "../../Services/httpService";
import GlobalColors from "../../Color/colors";
function SearchBox({ searchFunc, initValue = "" }) {
  const [textInput, setTextInput] = useState(initValue);
  useEffect(() => {
    setTextInput(initValue);
  }, [initValue]);
  function onTextHandler(enteredText) {
    setTextInput(enteredText);
  }

  function searchHandler() {
    searchFunc(textInput);
    // if (textInput.trim() === "") {
    //   Alert.alert("Warning", "You need to enter a movie name");
    //   return;
    // }
    // try {
    //   Keyboard.dismiss();
    //   await searchMovies(textInput)
    //     .then((response) => {
    //       searchFunc(response, textInput);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Enter a movie name"
        keyboardType="default"
        placeholderTextColor="#c8c0c0"
        onChangeText={onTextHandler}
        value={textInput}
        onSubmitEditing={searchHandler}
      />
      <View style={styles.searchIcon}>
        <IconButton
          icon={"search-outline"}
          size={24}
          color={GlobalColors.icon_non_active}
          onPress={searchHandler}
        />
      </View>
    </View>
  );
}

export default SearchBox;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: GlobalColors.searchBackground,
    borderRadius: 10,
    flexDirection: "row",
    padding: 10,
  },
  searchBox: {
    fontSize: 24,
    color: "white",
    marginRight: 5,
    width: "92%",
    fontWeight: "normal",
  },
  searchIcon: {
    marginRight: 5,
  },
});
