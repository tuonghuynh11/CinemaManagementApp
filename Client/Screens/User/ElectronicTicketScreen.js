import { View, StyleSheet, Text } from "react-native";
import EmptyTicket from "../../Components/UI/EmptyTicket";
import { Dimensions } from "react-native";
import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import TicketItem from "../../Components/Tickets/TicketItem";
import { fetchTickets } from "../../Util/firebase";
import CustomButton from "../../Components/UI/CustomButton";
import GlobalColors from "../../Color/colors";
const dimensions = Dimensions.get("window");
function ElectronicTicketScreen({ navigation, route }) {
  const [tickets, setTickets] = useState([]);
  const ticketInfo = {
    status: route.params.status,
    paymentMethod: route.params.paymentMethod,
    dateTime: new Date().setDate(route.params.tickets.date.date),
    cost: route.params.cost,
    tickets: route.params.tickets,
    seats: route.params.tickets.seats.seats.split(", "),
    rows: route.params.tickets.seats.rows.split(", "),
    ticketList: route.params.ticketList,
    isHistory: route?.params?.isHistory,
  };
  function renderTicketItem(itemData) {
    async function deleteTicketHandler() {
      try {
        // deleteTicketOfUser(authCtx.uid, itemData.item.id);
        // const response = await deleteTicket(itemData.item.id);
        // setTickets((tickets) =>
        //   tickets.filter((tk) => tk.id !== itemData.item.id)
        // );
        // await loadTickets();
      } catch (error) {
        console.log(error);
      }
    }
    function deleteTickets() {
      Alert.alert("Warning", "Are you sure delete", [
        {
          text: "Sure",
          onPress: () => {
            deleteTicketHandler();
          },
        },
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
        },
      ]);
    }
    //"date": {"date": 16, "day": "Mon", "year": 2023}
    return (
      <TicketItem
        posterImage={ticketInfo.tickets.movieDetail.poster_path}
        dateTime={ticketInfo.dateTime}
        time={ticketInfo.tickets.timeSelected}
        seats={itemData.item.seatNumber}
        row={itemData.item.row}
        hall={ticketInfo.tickets.hallSelected.auditoriumName}
        onDelete={deleteTickets}
        idTicket={itemData.item.reservationId}
        address={ticketInfo.tickets.cinemas.address}
        isDisable
      />
    );
  }
  function returnHomeHandler() {
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  }
  return (
    <View style={styles.root}>
      <View style={styles.subRoot}>
        <FlatList
          horizontal
          keyExtractor={(item, index) => index}
          data={ticketInfo.ticketList}
          renderItem={renderTicketItem}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: "100%",
                width: 5,
              }}
            />
          )}
          pagingEnabled
          style={{ width: dimensions.width + 5, height: "100%" }}
        />
      </View>
      {!ticketInfo.isHistory && (
        <View
          style={{
            margin: 10,
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            marginHorizontal: 20,
            marginTop: 0,
          }}
        >
          <CustomButton
            radius={10}
            color={GlobalColors.mainColor1}
            onPress={returnHomeHandler}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Return to home
            </Text>
          </CustomButton>
        </View>
      )}
    </View>
  );
}
export default ElectronicTicketScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  subRoot: {
    height: "93%",
    alignItems: "center",
    marginTop: -50,
  },
});
