import {
    Button,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Pressable,
    ScrollView,
    TouchableWithoutFeedback,
    SafeAreaView,
    Keyboard,
    FlatList,
    Modal,
  } from "react-native";
  import React, { useState } from "react";
  
  export default function DirectorModal({ visible, hide, uploadImage }) {
    const [validateGenre, setValidateGenre] = useState(true);
    const [Genre, setGenre] = useState("");
    const GenreHandler = (val) => {
      setGenre(val);
      setValidateGenre(true);
    };

    const [validateName, setValidateName] = useState(true);
    const [Name, setName] = useState("");
    const NameHandler = (val) => {
      setName(val);
      setValidateName(true);
    };

    const [validateRName, setValidateRName] = useState(true);
    const [RName, setRName] = useState("");
    const RNameHandler = (val) => {
      setRName(val);
      setValidateRName(true);
    };
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={hide}
        transparent
      >
        <Pressable style={styles.upper} onPress={hide}></Pressable>
        <View style={styles.lower}>
          <Text style={styles.textLabel}>Director Name</Text>
          <TextInput
            placeholderTextColor="#a28012"
            style={
              validateName == true ? styles.textInput : styles.textInputWrong
            }
            placeholder="Enter Director Name"
            value={Name}
            onChangeText={NameHandler}
          ></TextInput>
          {!validateName && (
            <Text style={styles.validateText}>This field can't be empty</Text>
          )}
          <Text style={styles.textLabel}>Real Name</Text>
          <TextInput
            placeholderTextColor="#a28012"
            style={
              validateRName == true ? styles.textInput : styles.textInputWrong
            }
            placeholder="Enter Real Name"
            value={RName}
            onChangeText={RNameHandler}
          ></TextInput>
          {!validateRName && (
            <Text style={styles.validateText}>This field can't be empty</Text>
          )}
          <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && { opacity: 0.85 },
              ]}
              //onPress={saveHadler}
            >
              <Text style={styles.saveText}>ADD</Text>
            </Pressable>
        </View>
      </Modal>
    );
  }
  
  const styles = StyleSheet.create({
    fill: {
      flex: 1,
    },
    upper: {
      height: "65%",
      backgroundColor: "#0C1941",
      opacity: 0.4,
    },
    lower: {
      flex: 1,
      backgroundColor: "white",
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      padding: 30,
    },
    choose: {
      flex: 1,
      backgroundColor: "#283663",
      marginHorizontal: 30,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 80,
      height: 80,
    },
    text: {
      fontWeight: "bold",
      color: "white",
    },
    textInput: {
      backgroundColor: "#283663",
      fontSize: 16,
      marginEnd: 20,
      marginStart: 20,
      height: 50,
      paddingLeft: 20,
      paddingRight: 40,
      borderRadius: 10,
      borderColor: "#FFCE31",
      borderWidth: 1,
      color: "#FFCE31",
    },
    textInputWrong: {
      backgroundColor: "#283663",
      fontSize: 16,
      marginEnd: 20,
      marginStart: 20,
      height: 50,
      paddingLeft: 20,
      paddingRight: 40,
      borderRadius: 10,
      borderColor: "#EB3223",
      borderWidth: 1,
      color: "#FFCE31",
    },
    textLabel: {
      color: "#a28012",
      marginLeft: 34,
      marginBottom: 5,
      marginTop: 10,
    },
    validateText: {
      color: "#EB3223",
      marginLeft: 40,
    },
    saveButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFCE31",
      marginHorizontal: "10%",
      height: 50,
      marginBottom: 10,
      borderRadius: 20,
      marginTop: 30,
    },
    saveText: {
      fontSize: 16,
      color: "#0C1941",
    },
  });
  