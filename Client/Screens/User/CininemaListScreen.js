import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Image,
  FlatList,
} from "react-native";
import IconLabel from "../../Components/UI/IconLabel";
import GlobalColors from "../../Color/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { GetAllCinemas } from "../../Util/databaseAPI";
import Loading from "../../Components/UI/Loading";
function CinemaListScreen({ navigation, route }) {
  const [cinemas, setCinemas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getCinema() {
      setIsLoading((curr) => !curr);
      const res = await GetAllCinemas();
      if (!res) {
        setIsLoading(false);
        return;
      }
      setCinemas(res);
      setIsLoading((curr) => !curr);
    }
    getCinema();
  }, []);

  function TheaterItem(itemData) {
    function onPressHandler() {
      navigation.navigate("MovieScheduleOfCinemaScreen", {
        cinemaId: itemData.item?.id,
        cinemaName: itemData.item?.name,
        cinemaAddress: itemData.item?.address,
      });
    }

    return (
      <Pressable
        style={({ pressed }) => [
          styles.cinemaItem,
          pressed ? styles.pressed : null,
        ]}
        onPress={onPressHandler}
      >
        <View style={styles.cinemaItem}>
          <Image
            defaultSource={require("../../../icon/defaultmovie.png")}
            style={styles.image}
            source={{
              uri: "https://www.vmcdn.ca/f/files/cambridgetoday/images/business/20231003_122200.jpg;w=960",
            }}
          />
          <View style={styles.container}>
            <Text style={styles.title} numberOfLines={2}>
              {itemData.item?.name}
            </Text>
            <View style={styles.iconLabel}>
              <Ionicons
                name={"ios-location-outline"}
                color={"white"}
                size={20}
              />
              <Text style={[styles.text, { color: "white" }]}>
                {itemData.item?.address}
              </Text>
            </View>

            <IconLabel
              icon="call-outline"
              size={20}
              color={"white"}
              title={"0893742822"}
            />
          </View>
        </View>
      </Pressable>
    );
  }
  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <View style={styles.root}>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{
              marginBottom: 110,
            }}
            data={cinemas}
            keyExtractor={(item, index) => index}
            renderItem={TheaterItem}
            ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          />
        </View>
      )}
    </>
  );
}
export default CinemaListScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
  },
  cinemaItem: {
    flexDirection: "row",
    backgroundColor: GlobalColors.lightBackground,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 0.2,
    width: "100%",
  },
  image: {
    width: 110,
    minHeight: 110,
    maxHeight: 150,
    borderRadius: 10,
    marginEnd: 10,
    borderColor: "white",
    borderWidth: 1,
  },
  container: {
    alignItems: "flex-start",
    width: "100%",
    // borderColor: GlobalColors.lightBackground,
  },
  title: {
    color: GlobalColors.button,
    fontSize: 21,
    marginLeft: 5,
    marginTop: 5,
    fontWeight: "bold",
    maxWidth: 214,
  },
  pressed: {
    opacity: 0.5,
  },
  iconLabel: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 12,
    color: "white",
    marginStart: 5,
    textAlign: "left",
    lineHeight: 20,
    maxWidth: 214,
  },
});
