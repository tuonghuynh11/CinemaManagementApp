import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import MovieCard from "./MovieCard";
import CinemaCard from "./CinemaCard";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { getAllTopMovies, getRevenue } from "../../Util/statictis";

export default function ManageStatistic({ navigation }) {
  const openMenu = () => {
    navigation.openDrawer();
  };
  const [indicator, setIndicator] = useState(false);

  const [movieList, setMovieList] = useState([]);
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  const isFocused = useIsFocused();

  const [dataReF, setDataReF] = useState([0, 0, 0, 0, 0, 0]);
  const [dataReS, setDataReS] = useState([0, 0, 0, 0, 0, 0]);


  const fetchTopMovies = async () => {
    if (isFocused) {
      try {
        setIndicator(true);
        const temp = await getRevenue();
        
        setDataReF(
          temp.revenueEachMonths
            .sort((a, b) => a.month - b.month)
            .filter((item) => item.month <= 6)
            .map((item) => item.totalRevenue)
        );
        setDataReS(
          temp.revenueEachMonths
            .sort((a, b) => a.month - b.month)
            .filter((item) => item.month > 6)
            .map((item) => item.totalRevenue)
        );
        //const data = await getAllTopMovies();
        const data = {result: [{"movieId": 873, "movieTitle": "The Color Purple", "numberOfViews": 7, "premiereDate": "1985-12-18", "revenue": 394.66}, {"movieId": 280, "movieTitle": "Terminator 2: Judgment Day", "numberOfViews": 4, "premiereDate": "1991-07-03", "revenue": 359.12}, {"movieId": 12, "movieTitle": "Finding Nemo", "numberOfViews": 2, "premiereDate": "2003-05-30", "revenue": 174.34}, {"movieId": 489, "movieTitle": "Good Will Hunting", "numberOfViews": 2, "premiereDate": "1997-12-05", "revenue": 142.72}, {"movieId": 675, "movieTitle": "Harry Potter and the Order of the Phoenix", "numberOfViews": 3, "premiereDate": "2007-07-08", "revenue": 94.35}, {"movieId": 157, "movieTitle": "Star Trek III: The Search for Spock", "numberOfViews": 1, "premiereDate": "1984-06-01", "revenue": 83.91}, {"movieId": 956, "movieTitle": "Mission: Impossible III", "numberOfViews": 4, "premiereDate": "2006-04-25", "revenue": 71.24}, {"movieId": 148, "movieTitle": "The Secret Life of Words", "numberOfViews": 2, "premiereDate": "2005-12-15", "revenue": 45.82}, {"movieId": 494, "movieTitle": "Shaft in Africa", "numberOfViews": 0, "premiereDate": "1973-06-14", "revenue": 0}, {"movieId": 35, "movieTitle": "The Simpsons Movie", "numberOfViews": 0, "premiereDate": "2007-07-25", "revenue": 0}], "year": 2023}

        setData({
          labels: data.result.map((movie) => movie.movieTitle),
          datasets: [
            {
              data: data.result.map((movie) => movie.numberOfViews),
            },
          ],
        });

        //console.log(data);

        // setCinemaList(data);
        // setCinemaListData(data);
        setIndicator(false);
      } catch (error) {
        // Handle error, e.g., redirect to login if unauthorized
        console.log("Error fetching top movie:", error);
        setIndicator(false)
      }
    }
  };

  useEffect(() => {
    fetchTopMovies();
  }, [isFocused]);
  // console.log(data);

  // console.log(dataReF);
  // console.log(dataReS);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
      <ActivityIndicator
          style={styles.indicator}
          size={"large"}
          animating={indicator}
        />
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.menuIcon,
              pressed && { opacity: 0.85 },
            ]}
            onPress={openMenu}
          >
            <Entypo name="menu" size={30} color="#FFCE31" />
          </Pressable>

          <Text style={styles.headerText}>Statistics</Text>
          {/* <Pressable
            style={({ pressed }) => [
              styles.addIconStyle,
              pressed && { opacity: 0.85 },
            ]}
            onPress={pressAddHandler}
          >
            <AntDesign name="pluscircle" size={30} color="#FFCE31" />
          </Pressable> */}
        </View>
        <ScrollView style={styles.body}>
          <Text style={styles.titleText}>Revenue first half of the year</Text>
          <LineChart
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  data: dataReF,
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginHorizontal: 5,
              marginRight: 10,
            }}
          />

          <Text style={styles.titleText}>Revenue second half of the year</Text>
          <LineChart
            data={{
              labels: [
                "July",
                "August",
                "Septemper",
                "October",
                "November",
                "December",
              ],
              datasets: [
                {
                  data: dataReS,
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisLabel="$"
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e2000f",
              backgroundGradientFrom: "#fb0026",
              backgroundGradientTo: "#ff617e",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginHorizontal: 5,
              marginRight: 10,
            }}
          />

          <Text style={styles.titleText}>Top movie</Text>
          <BarChart
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginBottom: 20,
              paddingBottom: 20,
            }}
            data={data}
            width={Dimensions.get("window").width}
            height={550}
            yAxisLabel="View"
            chartConfig={{
              backgroundColor: "#e200c8",
              backgroundGradientFrom: "#c000fb",
              backgroundGradientTo: "#dd98ff",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              styles: {
                paddingRight: 20,
              },
              barPercentage: 0.6,
            }}
            verticalLabelRotation={30}
            showValuesOnTopOfBars
            fromZero
          />
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    backgroundColor: "#0C1941",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    position: "absolute",
    left: 16,
  },
  headerText: {
    fontSize: 23,
    color: "#FFCE31",
  },
  addIconStyle: {
    position: "absolute",
    right: 16,
  },
  body: {
    flex: 1,
  },
  bodySearch: {
    flex: 8,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  textInputSearch: {
    backgroundColor: "#283663",
    flex: 1,
    paddingLeft: 20,
    paddingRight: 40,
    paddingVertical: 8,
    borderRadius: 10,
    height: 54,
    color: "white",
  },
  iconCancel: {
    position: "absolute",
    top: 28,
    right: 20,
  },
  bodyList: {
    flex: 1,
  },
  filter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingEnd: 6,
  },
  titleText: {
    color: "#FFCE31",
    fontSize: 20,
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 10,
  },
  indicator: {
    position: "absolute",
    zIndex: 1000,
    right: "46%",
    top: "50%",
  },
});
