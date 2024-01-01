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

export default function ModalChooseImage({ visible, hide, uploadImage }) {
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
          style={({ pressed }) => [styles.choose, pressed && { opacity: 0.85 }]}
          onPress={uploadImage}
        >
          <Image
            source={require("../../../assets/cameraIcon.png")}
            style={styles.image}
          ></Image>
          <Text style={styles.text}>Camera</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.choose, pressed && { opacity: 0.85 }]}
          onPress={() => uploadImage("gallery")}
        >
          <Image
            source={require("../../../assets/galleryIcon.png")}
            style={styles.image}
          ></Image>
          <Text style={styles.text}>Gallery</Text>
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
    height: "80%",
    backgroundColor: "#0C1941",
    opacity: 0.4,
  },
  lower: {
    flex: 1,
    flexDirection: "row",
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
});
