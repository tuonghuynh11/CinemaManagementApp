import {
    Button,
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    Pressable,
  } from "react-native";
  import React, { useState } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import placeholder from "../../../assets/noMovieImg.jpg";
  
  export default function ActorCard({ item, navigation }) {
    const img = "https://image.tmdb.org/t/p/original";
    const pressHandler = () => {
      //navigation.navigate("EditCoach");
    };
    return (
      <View style={styles.container}>
        {/*status*/}
  
        <View style={styles.contentView}>
          {/**Image of coach */}
  
          <Image style={styles.imageMovie} source={item.profile_path!=""?{uri: img+item.profile_path}:placeholder} />
  
          <View style={styles.info}>
            {/**coachnum, type */}
            <Text style={styles.text}>Name: {item.name}</Text>
            {item.character && <Text style={styles.text}>Character: {item.character}</Text>}
            {!item.character && <Text style={styles.text}>Real Name: {item.name}</Text>}
          </View>
          
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: "#283663",
      shadowOffset: { width: 1, height: 1 },
      shadowColor: "#333333",
      shadowOpacity: 0.3,
      shadowRadius: 2,
      marginHorizontal: 20,
      marginVertical: 20,
    },
    statusText: {
      color: "white",
      backgroundColor: "#72C6A1",
      fontSize: 20,
      width: "40%",
      borderRadius: 10,
      textAlign: "center",
      margin: 5,
    },
    statusTextArr: {
      color: "white",
      backgroundColor: "#e9dd01",
      fontSize: 20,
      width: "40%",
      borderRadius: 10,
      textAlign: "center",
      margin: 5,
    },
    contentView: {
      flex: 1,
      flexDirection: "row",
    },
    imageMovie: {
      flex: 2,
      width: 70,
      height: 100,
      resizeMode: "contain",
      marginLeft: 10,
      borderRadius: 10,
      marginBottom: 10,
      marginTop: 15,
    },
    info: {
      flex: 8,
      paddingTop: 10,
      paddingLeft: 15,
      marginTop: 20,
      paddingRight: 20
    },
    edit: {
      flex: 1,
      paddingEnd: 5,
      marginLeft: 5
    },
    text: {
      flex: 1,
      fontSize: 18,
      color: "#FFFFFF",
      fontWeight: "600",
    },
    icon: {
      flex: 1,
      paddingTop: 5,
    },
  });
  