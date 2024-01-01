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
  
  export default function FilterFDModal({
    visible,
    hide,
    handlerSort
  }) {
    const [flag, setFlag] = useState(0);
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={hide}
        transparent
      >
        <Pressable style={styles.upper} onPress={hide}></Pressable>
        <View style={styles.lower}>
          
          <Pressable
            style={flag == 1 ? styles.pressedButton : styles.choose}
            onPress={() => {
              handlerSort("1"), setFlag(1);
            }}
          >
            
            <Text style={styles.text}>Popcorn</Text>
          </Pressable>
          <Pressable
            style={flag == 2 ? styles.pressedButton : styles.choose}
            onPress={() => {
              handlerSort("2"), setFlag(2);
            }}
          >
            
            <Text style={styles.text}>Beverage</Text>
          </Pressable>
          <Pressable
            style={flag == 3 ? styles.pressedButton : styles.choose}
            onPress={() => {
              handlerSort("3"), setFlag(3);
            }}
          >
            
            <Text style={styles.text}>Combo</Text>
          </Pressable>
          
          <Pressable
            style={flag == 0 ? styles.pressedButton : styles.choose}
            onPress={() => {
              handlerSort(''), setFlag(0);
            }}
          >
            
            <Text style={styles.text}>Default</Text>
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
      backgroundColor: "#0C1941",
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      padding: 10,
    },
    choose: {
      flex: 1,
      backgroundColor: "#72C6A1",
      marginHorizontal: 30,
      flexDirection: "row",
      borderRadius: 20,
      alignItems: "center",
      marginTop: 20,
      justifyContent: "center",
    },
    text: {
      fontWeight: "bold",
      color: "white",
    },
    title: {
      fontWeight: "bold",
      fontSize: 20,
      marginTop: 10,
    },
    pressedButton: {
      flex: 1,
      backgroundColor: "#FFCE31",
      marginHorizontal: 30,
      flexDirection: "row",
      borderRadius: 20,
      alignItems: "center",
      marginTop: 20,
      justifyContent: "center",
    },
  });
  