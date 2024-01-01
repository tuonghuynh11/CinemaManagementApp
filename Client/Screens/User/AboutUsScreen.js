import { Image, StyleSheet, View, Text } from "react-native";
function AboutUsScreen() {
  return (
    <View style={styles.root}>
      <Image
        style={styles.image}
        source={require("../../../assets/logo_transparent.png")}
      />
      <Text style={styles.content}>
        In the ever-evolving landscape of entertainment and hospitality, the
        Cinema Management Application stands as a technological marvel, a beacon
        of efficiency and innovation in the realm of movie theaters. Spanning
        across thousands of lines of code and countless hours of development,
        this software masterpiece has been meticulously crafted to revolutionize
        the cinema industry. At its core, it is a robust and comprehensive tool
        designed to empower cinema owners, managers, and patrons alike. With its
        multifaceted suite of features, it seamlessly orchestrates the complex
        symphony of movie scheduling, ticket sales, concession stand management,
        customer loyalty programs, and data analytics. It ushers in a new era
        where the seamless, immersive movie-going experience is not just a dream
        but a tangible reality. Through this application, cinema owners can take
        full command of their theaters, shaping them into efficient,
        customer-centric hubs of entertainment. From the moment the lights dim
        and the projector starts rolling, the Cinema Management Application
        ensures that every element of the cinema experience is finely tuned and
        synchronized to create an unforgettable cinematic journey for every
        patron, from the eager ticket buyer to the satisfied popcorn-munching
        movie lover. It's a technological marvel, a beacon of efficiency, and a
        revolution in the cinema industry, promising to redefine the way we
        experience the magic of the silver screen.
      </Text>
      <Text style={styles.text}>Version 1</Text>
    </View>
  );
}
export default AboutUsScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: "20%",
  },
  text: {
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 20,
    opacity: 0.5,
    fontSize: 18,
    color: "white",
  },
  content: {
    textAlign: "center",
    fontSize: 14,
    color: "white",
  },
});
