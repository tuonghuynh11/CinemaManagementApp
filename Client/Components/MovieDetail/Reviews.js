import { FlatList } from "react-native";
import ReviewItem from "../Review/ReviewItem";

function Reviews({ reviews, route }) {
  return (
    <FlatList
      keyExtractor={(item) => item.id}
      data={reviews}
      renderItem={(itemData) => {
        return <ReviewItem review={itemData.item} />;
      }}
    />
  );
}
export default Reviews;
