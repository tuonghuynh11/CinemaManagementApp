import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlatList, Text } from "react-native";
import { View, StyleSheet } from "react-native";
import Reviews from "../../Components/MovieDetail/Reviews";
import { Entypo } from "@expo/vector-icons";
import GlobalColors from "../../Color/colors";
import FoodBeverageItem from "../../Components/MovieTicket/FoodBeverageItem";
import { useContext, useEffect, useState } from "react";
import { Pressable } from "react-native";
import { addDotsToNumber } from "../../Helper/NumberHelper";
import { Image } from "react-native";
import IconButton from "../../Components/UI/IconButton";
import { BookingContext } from "../../Store/bookingContext";
import { GetMenuOfCinema } from "../../Util/databaseAPI";
import Loading from "../../Components/UI/Loading";
const Tab = createMaterialTopTabNavigator();
function SelectFoodBeverageScreen({ navigation, route }) {
  const [combos, setCombos] = useState([]);
  const [popcorns, setPopcorns] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const [itemSelectedList, setItemSelectedList] = useState([]);
  const [cost, setCost] = useState(route.params.totalCost);
  const bookingCtx = useContext(BookingContext);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // const a = [
    //   {
    //     id: 1,
    //     image:
    //       "https://www.cinesystem.com.br/bomboniere/images/combos/combo-max-duplo.png",
    //     title: "Regular Combo",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 100000,
    //     quantitySelected: 0,
    //   },
    //   {
    //     id: 2,
    //     image:
    //       "https://www.cinesystem.com.br/bomboniere/images/combos/combo-max-duplo.png",
    //     title: "Regular Combo",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 100000,
    //     quantitySelected: 0,
    //   },
    //   {
    //     id: 3,
    //     image:
    //       "https://www.cinesystem.com.br/bomboniere/images/combos/combo-max-duplo.png",
    //     title: "Regular Combo",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 70000,
    //     quantitySelected: 0,
    //   },
    //   {
    //     id: 4,
    //     image:
    //       "https://www.cinesystem.com.br/bomboniere/images/combos/combo-max-duplo.png",
    //     title: "Regular Combo",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 50000,
    //     quantitySelected: 0,
    //   },
    // ];
    // const b = [
    //   {
    //     id: 1,
    //     image:
    //       "https://purepng.com/public/uploads/large/purepng.com-popcornfood-box-corn-bucket-popcorn-movie-film-cinema-941524633493b9owo.png",
    //     title: "PopCorn",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 70000,
    //     quantitySelected: 0,
    //   },
    //   {
    //     id: 2,
    //     image:
    //       "https://purepng.com/public/uploads/large/purepng.com-popcornfood-box-corn-bucket-popcorn-movie-film-cinema-941524633493b9owo.png",
    //     title: "PopCorn",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 70000,
    //     quantitySelected: 0,
    //   },
    //   {
    //     id: 3,
    //     image:
    //       "https://purepng.com/public/uploads/large/purepng.com-popcornfood-box-corn-bucket-popcorn-movie-film-cinema-941524633493b9owo.png",
    //     title: "PopCorn",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 70000,
    //     quantitySelected: 0,
    //   },
    //   {
    //     id: 4,
    //     image:
    //       "https://purepng.com/public/uploads/large/purepng.com-popcornfood-box-corn-bucket-popcorn-movie-film-cinema-941524633493b9owo.png",
    //     title: "PopCorn",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 70000,
    //     quantitySelected: 0,
    //   },
    // ];
    // const c = [
    //   {
    //     id: 1,
    //     image:
    //       "https://i.pinimg.com/originals/0c/49/62/0c49624a6a560c5d07de72a7f21da4e6.png",
    //     title: "Pepsi",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 40000,
    //     quantitySelected: 0,
    //   },
    //   {
    //     id: 2,
    //     image:
    //       "https://i.pinimg.com/originals/0c/49/62/0c49624a6a560c5d07de72a7f21da4e6.png",
    //     title: "Pepsi",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 20000,
    //     quantitySelected: 0,
    //   },
    //   {
    //     id: 3,
    //     image:
    //       "https://i.pinimg.com/originals/0c/49/62/0c49624a6a560c5d07de72a7f21da4e6.png",
    //     title: "Pepsi",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 30000,
    //     quantitySelected: 0,
    //   },
    //   {
    //     id: 4,
    //     image:
    //       "https://i.pinimg.com/originals/0c/49/62/0c49624a6a560c5d07de72a7f21da4e6.png",
    //     title: "Pepsi",
    //     detail: "French fries.Cheeseburger Fast food.Whopper Hamburger",
    //     price: 60000,
    //     quantitySelected: 0,
    //   },
    // ];
    // setCombos(a);
    // setPopcorns(b);
    // setBeverages(c);

    async function getMenu(cinemaId) {
      setIsLoading((curr) => !curr);
      const res = await GetMenuOfCinema(cinemaId);
      if (!res) {
        setIsLoading(false);

        return;
      }
      console.log("menu", res);
      let combo = [];
      let popcorn = [];
      let beverage = [];
      res?.forEach((item) => {
        if (item?.availability) {
          const temp = {
            id: item?.foodAndDrinkId,
            image: item?.foodAndDrink?.imageUrl,
            title: item?.foodAndDrink?.name,
            detail: item?.foodAndDrink?.description,
            price: item?.price,
            servingSize: item?.servingSize,
            quantitySelected: 0,
          };
          if (item?.foodAndDrink?.category === "Popcorn") {
            popcorn.push(temp);
          } else if (item?.foodAndDrink?.category === "Beverage") {
            beverage.push(temp);
          } else {
            combo.push(temp);
          }
        }
      });
      setCombos(combo);
      setPopcorns(popcorn);
      setBeverages(beverage);
      setIsLoading((curr) => !curr);
    }
    getMenu(bookingCtx.bookingInfo.cinemaId);
  }, []);

  function renderFoodItem(itemData, tabName) {
    function onQuantityChangeHandler(type) {
      if (type == "plus") {
        if (tabName === "combo") {
          combos[itemData.index].quantitySelected++;
          setCombos((curr) => [...curr]);
        } else if (tabName === "popcorn") {
          popcorns[itemData.index].quantitySelected++;
          setPopcorns((curr) => [...curr]);
        } else {
          beverages[itemData.index].quantitySelected++;
          setBeverages((curr) => [...curr]);
        }

        const isExist = itemSelectedList.find(
          (item) => item.type === tabName && item.index === itemData.index
        );
        if (isExist) {
          // console.log(isExist.value.quantitySelected);

          isExist.value.quantitySelected++;
          setCost((curr) => curr + isExist.value.price);
        } else {
          itemSelectedList.push({
            type: tabName,
            index: itemData.index,
            value: { ...itemData.item },
          });
          setCost((curr) => curr + itemData.item.price);
        }
      } else {
        const isExist = itemSelectedList.find(
          (item) => item.type === tabName && item.index === itemData.index
        );

        if (isExist) {
          setCost((curr) => curr - isExist.value.price);

          const isEmpty = isExist.value.quantitySelected - 1 === 0;
          if (isEmpty) {
            // console.log(isExist);
            setItemSelectedList((curr) =>
              curr.filter(
                (item) =>
                  item.type !== isExist.tabName && item.index !== isExist.index
              )
            );
          } else {
            isExist.value.quantitySelected--;
            setItemSelectedList((curr) => [...curr]);
          }
        }

        if (tabName == "combo") {
          if (combos[itemData.index].quantitySelected - 1 < 0) {
            return;
          }
          combos[itemData.index].quantitySelected--;
          setCombos((curr) => [...curr]);
        } else if (tabName == "popcorn") {
          if (popcorns[itemData.index].quantitySelected - 1 < 0) {
            return;
          }
          popcorns[itemData.index].quantitySelected--;
          setPopcorns((curr) => [...curr]);
        } else {
          if (beverages[itemData.index].quantitySelected - 1 < 0) {
            return;
          }
          beverages[itemData.index].quantitySelected--;
          setBeverages((curr) => [...curr]);
        }
      }
      setItemSelectedList((curr) => [...curr]);
    }
    return (
      <FoodBeverageItem item={itemData.item} action={onQuantityChangeHandler} />
    );
  }

  function renderMiniItem(itemData) {
    return (
      <View style={{ marginTop: 5 }}>
        <View
          style={{
            backgroundColor: GlobalColors.mainColor2,
            padding: 5,
            borderRadius: 10,
            flexDirection: "row",
            gap: 5,
            width: 120,
            alignItems: "center",
          }}
        >
          <Image
            defaultSource={require("../../../icon/defaultImage.png")}
            style={{ height: 30, width: 30 }}
            source={{ uri: itemData.item.value.image }}
          />
          <View>
            <Text
              style={{ maxWidth: 60, color: "white", opacity: 0.8 }}
              numberOfLines={1}
            >
              {itemData.item.value.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 4,
              }}
            >
              <Text
                style={{
                  maxWidth: 50,
                  fontWeight: "bold",
                  fontSize: 10,
                }}
                numberOfLines={1}
              >
                $ {addDotsToNumber(itemData.item.value.price)}
              </Text>

              <Text
                style={{
                  maxWidth: 80,
                  fontWeight: "bold",
                  fontSize: 15,
                  color: "red",
                }}
                numberOfLines={1}
              >
                x{itemData.item.value.quantitySelected}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ position: "absolute", top: -13, right: -13 }}>
          <IconButton
            icon={"close-circle"}
            size={20}
            color={"red"}
            onPress={() => {
              if (itemData.item.type == "combo") {
                setCost(
                  (curr) =>
                    curr -
                    combos[itemData.item.index].quantitySelected *
                      combos[itemData.item.index].price
                );
                combos[itemData.item.index].quantitySelected = 0;
                setCombos((curr) => [...curr]);
              } else if (itemData.item.type == "popcorn") {
                setCost(
                  (curr) =>
                    curr -
                    popcorns[itemData.item.index].quantitySelected *
                      popcorns[itemData.item.index].price
                );
                popcorns[itemData.item.index].quantitySelected = 0;
                setPopcorns((curr) => [...curr]);
              } else {
                setCost(
                  (curr) =>
                    curr -
                    beverages[itemData.item.index].quantitySelected *
                      beverages[itemData.item.index].price
                );
                beverages[itemData.item.index].quantitySelected = 0;
                setBeverages((curr) => [...curr]);
              }
              setItemSelectedList((curr) =>
                curr.filter((item, index) => index !== itemData.index)
              );
            }}
          />
        </View>
      </View>
    );
  }
  function recheckTicketHandler() {
    // console.log(route.params.movieDetail);
    // console.log(JSON.stringify(itemSelectedList.map((item) => item.value)));
    const temp = { ...bookingCtx.bookingInfo };
    let temp2 = [];

    // console.log(itemSelectedList[0].value);
    // return;
    itemSelectedList.forEach((item) => {
      for (let i = 0; i < item.value.quantitySelected; i++) {
        temp2.push(item);
      }
    });
    temp.menus = temp2.map((item) => {
      return {
        foodAndDrinkId: item.value.id,
        servingSize: item.value.servingSize,
      };
    });
    bookingCtx.setBookingInfo(temp);

    bookingCtx.resetTimeout();
    bookingCtx.startTimeout();
    navigation.navigate("RecheckTicketScreen", {
      movieId: route.params.movieId,
      backdrop_path: route.params.backdrop_path,
      foodBeverageCost: cost - route.params.totalCost,
      ticketCost: route.params.totalCost,
      timeSelected: route.params.timeSelected,
      date: route.params.date,
      movieDetail: route.params.movieDetail,
      seats: route.params.seats,
      cinemas: route.params.cinemas,
      hallSelected: route.params.hallSelected,
      foodBeverageInfo: itemSelectedList.map((item) => item.value),
    });
  }

  function addDotsToNumbers(number) {
    if (number.toString() === "0") return "0";
    if (number) {
      number = number.toFixed(2);
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <View style={styles.root}>
          <Text style={styles.header}>Give yourself a little taste!!</Text>
          <View style={styles.navigateContainer}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarLabelStyle: {
                  fontSize: 14,
                },
                tabBarAllowFontScaling: true,
                tabBarInactiveTintColor: "#c8c0c0",
                tabBarActiveTintColor: GlobalColors.icon_active,
                tabBarIndicatorStyle: {
                  // borderBottomWidth: 1,
                  borderColor: GlobalColors.icon_active,
                },
                tabBarLabel: ({ focused }) => {
                  return (
                    <View
                      style={{
                        alignItems: "center",
                        width: 150,
                      }}
                    >
                      {focused && (
                        <Entypo
                          name="dot-single"
                          size={30}
                          color={GlobalColors.mainColor1}
                          style={{
                            alignSelf: "flex-start",
                            position: "absolute",
                            top: -10,
                            left: 15,
                          }}
                        />
                      )}
                      <Text
                        style={{
                          fontWeight: focused ? "800" : "400",
                          color: "white",
                          fontSize: 15,
                        }}
                      >
                        {route.name}
                      </Text>
                    </View>
                  );
                },
              })}
            >
              <Tab.Screen name="Combo">
                {(props) => (
                  <View style={{ margin: 10, marginBottom: 30 }}>
                    <FlatList
                      data={combos}
                      keyExtractor={(item) => item.id + item.servingSize}
                      renderItem={(itemData) =>
                        renderFoodItem(itemData, "combo")
                      }
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 20 }} />
                      )}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                )}
              </Tab.Screen>
              <Tab.Screen name="Popcorn">
                {(props) => (
                  <View style={{ margin: 10, marginBottom: 30 }}>
                    <FlatList
                      data={popcorns}
                      keyExtractor={(item) => item.id + item.servingSize}
                      renderItem={(itemData) =>
                        renderFoodItem(itemData, "popcorn")
                      }
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 20 }} />
                      )}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                )}
              </Tab.Screen>

              <Tab.Screen name="Beverages">
                {(props) => (
                  <View style={{ margin: 10, marginBottom: 30 }}>
                    <FlatList
                      data={beverages}
                      keyExtractor={(item) => item.id + item.servingSize}
                      renderItem={(itemData) =>
                        renderFoodItem(itemData, "beverage")
                      }
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 20 }} />
                      )}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          </View>
          <View
            style={{
              marginBottom: 90,
              justifyContent: "center",
              marginTop: -15,
            }}
          >
            <FlatList
              style={{ paddingBottom: 10 }}
              horizontal
              data={itemSelectedList}
              keyExtractor={(item, index) => index}
              renderItem={renderMiniItem}
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            />
          </View>

          <View>
            <View style={styles.rootPaymentContainer}>
              <View style={styles.rootPayment}>
                <View style={styles.payment}>
                  <View style={styles.total}>
                    <Text style={styles.totalText}>Total Price</Text>
                    <View style={styles.price}>
                      <Text style={styles.priceText}>
                        $ {addDotsToNumbers(cost)}
                      </Text>
                      {/* <Text style={{ color: "white", fontSize: 25 }}> VND</Text> */}
                    </View>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.buyTicket,
                      pressed && styles.pressed,
                    ]}
                    onPress={recheckTicketHandler}
                  >
                    <Text style={styles.buyStyle}>Continue</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

export default SelectFoodBeverageScreen;
const styles = StyleSheet.create({
  root: {
    // flex: 1,
    height: "100%",

    // margin: 10,
  },
  header: {
    textAlign: "center",
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
  },
  navigateContainer: {
    flex: 1,
    marginTop: 20,
    height: "100%",
    marginHorizontal: 10,
  },
  payment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  rootPayment: {
    width: "100%",
    backgroundColor: GlobalColors.lightBackground,
    height: 120,
    justifyContent: "center",
    paddingBottom: 40,
  },
  rootPaymentContainer: {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
    bottom: 50,
    height: 40,
  },
  total: {
    justifyContent: "center",
    alignItems: "center",
  },
  totalText: {
    color: "gray",
    fontSize: 14,
  },
  price: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    color: "white",
    fontSize: 25,
  },
  buyStyle: { color: "white", fontWeight: "bold" },
  buyTicket: {
    backgroundColor: "orange",
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  pressed: {
    opacity: 0.6,
  },
});
