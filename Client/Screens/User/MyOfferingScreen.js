import { View, StyleSheet, FlatList, Image, Text } from "react-native";
import GlobalColors from "../../Color/colors";
import { useContext, useEffect, useState } from "react";
import { getDate } from "../../Helper/DateTime";
import { GetAllDiscountOfUser } from "../../Util/databaseAPI";
import { AuthContext } from "../../Store/authContext";
import Loading from "../../Components/UI/Loading";
function MyOfferingScreen() {
  const [newDiscountList, setNewDiscountList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const [prepareExpiredDiscountList, setPrepareExpiredDiscountList] = useState(
    []
  );

  useEffect(() => {
    async function getDiscount() {
      setIsLoading((curr) => !curr);
      const res = await GetAllDiscountOfUser(authCtx.idUser);
      if (!res || res.length === 0) {
        setIsLoading((curr) => !curr);

        return;
      }
      console.log("discounts: ", res);
      const discounts = res?.map((item) => {
        if (item.usage) {
          return;
        }
        return {
          id: item.discountId,
          title: `Discount ${item.discount.percentage}%`,
          expireDate: new Date(item.discount.expireDate),
          value: item.discount.percentage,
          minimumPriceToApply: item.discount.minimumInvoice,
          maximumDiscountPrice: item.discount.maximumDiscount,
          status: item.usage,
        };
      });
      // const discounts = [
      //   {
      //     id: 1,
      //     title: "Discount 50%",
      //     expireDate: new Date(2023, 10, 11),
      //     value: 50,
      //     minimumPriceToApply: 10,
      //     maximumDiscountPrice: 20,
      //     status: 1,
      //   },
      //   // {
      //   //   id: 2,
      //   //   title: "Discount 45%",
      //   //   expireDate: new Date(2023, 10, 11),
      //   //   value: 45,
      //   // },
      //   // {
      //   //   id: 3,
      //   //   title: "Discount 55%",
      //   //   expireDate: new Date(2023, 10, 11),
      //   //   value: 55,
      //   // },
      //   // {
      //   //   id: 4,
      //   //   title: "Discount 90%",
      //   //   expireDate: new Date(2023, 10, 11),
      //   //   value: 90,
      //   // },
      //   // {
      //   //   id: 5,
      //   //   title: "Discount 100%",
      //   //   expireDate: new Date(2023, 10, 11),
      //   //   value: 100,
      //   // },
      //   // {
      //   //   id: 6,
      //   //   title: "Discount 30%",
      //   //   expireDate: new Date(2023, 9, 11),
      //   //   value: 30,
      //   // },
      //   // {
      //   //   id: 7,
      //   //   title: "Discount 20%",
      //   //   expireDate: new Date(2023, 9, 13),
      //   //   value: 20,
      //   // },
      //   // {
      //   //   id: 8,
      //   //   title: "Discount 10%",
      //   //   expireDate: new Date(2023, 9, 14),
      //   //   value: 10,
      //   // },
      //   // {
      //   //   id: 9,
      //   //   title: "Discount 5%",
      //   //   expireDate: new Date(2023, 9, 15),
      //   //   value: 5,
      //   // },
      // ];
      const newDis = [];
      const odlDis = [];
      discounts.forEach((discount) => {
        if (
          numberDaysBetweenTwoDays(new Date(), discount.expireDate) < 0 ||
          discount.status
        ) {
          return;
        }
        if (numberDaysBetweenTwoDays(new Date(), discount.expireDate) < 3) {
          odlDis.push(discount);
        } else {
          newDis.push(discount);
        }
      });
      setPrepareExpiredDiscountList(odlDis);
      setNewDiscountList(newDis);
      setIsLoading((curr) => !curr);
    }
    getDiscount();
  }, []);
  function numberDaysBetweenTwoDays(date1, date2) {
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days;
  }
  function addDotsToNumber(number) {
    if (number.toString() === "0") return "0";
    if (number) {
      number = number.toFixed(2);
    }
    if (number) return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  function renderDiscountItem(itemData, type) {
    const numberOfDays = numberDaysBetweenTwoDays(
      new Date(),
      new Date(itemData.item.expireDate)
    );
    return (
      // <View style={styles.discountItem}>
      //   <View style={{ gap: 10 }}>
      //     <Text style={styles.discountTitle}>{itemData.item.title}</Text>
      //     <Text>Expire date : {getDate(itemData.item.expireDate)}</Text>
      //   </View>
      //   <Image
      //     style={{ width: 40, height: 40 }}
      //     source={
      //       type === "new"
      //         ? require("../../../icon/newDiscount.png")
      //         : require("../../../icon/oldDiscount.png")
      //     }
      //   />
      // </View>
      <View style={styles.discountItem}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <Image
            style={{ width: 62, height: 62 }}
            source={
              numberDaysBetweenTwoDays(new Date(), itemData.item.expireDate) >=
              3
                ? require("../../../icon/newDiscount.png")
                : require("../../../icon/oldDiscount.png")
            }
          />
        </View>
        <View style={{ gap: 10, flex: 2 }}>
          <Text style={styles.discountTitle}>{itemData.item.title}</Text>
          <Text style={{ fontSize: 16, fontWeight: 400 }}>
            Minimum invoice{" "}
            <Text
              style={{
                color: "red",
                fontWeight: 600,
              }}
            >
              ${addDotsToNumber(itemData.item.minimumPriceToApply)}
            </Text>
          </Text>
          <View
            style={{
              padding: 2,
              borderWidth: 1,
              borderColor: "#f70010c5",
              alignItems: "flex-start",
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                color: "#f70010c5",
                fontSize: 13,
              }}
            >
              Maximum ${addDotsToNumber(itemData.item.maximumDiscountPrice)}
            </Text>
          </View>
          {numberOfDays <= 4 && (
            <Text
              style={[
                numberOfDays < 2 && { color: "red" },
                {
                  fontSize: 13,
                },
              ]}
            >
              Expire date : {getDate(itemData.item.expireDate)}
              {" ("}
              {numberOfDays.toFixed(0)}
              {numberOfDays >= 2 ? " days)" : " day)"}
            </Text>
          )}
          {numberOfDays > 4 && (
            <Text
              style={[
                numberOfDays < 2 && { color: "red" },
                {
                  fontSize: 13,
                },
              ]}
            >
              Expire date : {getDate(itemData.item.expireDate)}
            </Text>
          )}
        </View>
      </View>
    );
  }
  return (
    <>
      {isLoading && <Loading />}
      {!isLoading && (
        <View style={styles.root}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              New Discount ({newDiscountList.length})
            </Text>
            <FlatList
              data={newDiscountList}
              renderItem={(itemData) => renderDiscountItem(itemData, "new")}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {prepareExpiredDiscountList.length !== 0 && (
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: GlobalColors.validate }]}>
                Prepare to expire ({prepareExpiredDiscountList.length})
              </Text>
              <FlatList
                data={prepareExpiredDiscountList}
                renderItem={(itemData) => renderDiscountItem(itemData, "old")}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      )}
    </>
  );
}
export default MyOfferingScreen;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    margin: 20,
    backgroundColor: "#72C6A1",
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 30,
    padding: 20,
    gap: 10,
  },
  discountItem: {
    padding: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalColors.price,
    marginBottom: 10,
  },
  discountTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
