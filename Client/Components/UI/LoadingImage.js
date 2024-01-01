import { Component, useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

function LoadingImage({ source }) {
  const [isLoading, setIsLoading] = useState(false);

  //   if (isLoading) {
  //     return (
  //       <View style={styles.image1}>
  //         <ActivityIndicator />
  //       </View>
  //     );
  //   }
  useEffect(() => {
    console.log("Loading Image");
  }, [isLoading]);
  return (
    <>
      {isLoading && (
        <View style={styles.image1}>
          <ActivityIndicator />
        </View>
      )}
      {!isLoading && (
        <Image
          defaultSource={require("../../../icon/defaultmovie.png")}
          style={styles.image1}
          source={{ uri: source }}
          onLoadStart={() => setIsLoading(false)}
          onLoadEnd={() => setIsLoading(false)}
        />
      )}
    </>
  );
}
export default LoadingImage;
const styles = StyleSheet.create({
  image1: {
    width: 110,
    height: 180,
    borderRadius: 15,
    marginEnd: 10,
    borderColor: "white",
    borderWidth: 1,
  },
});
