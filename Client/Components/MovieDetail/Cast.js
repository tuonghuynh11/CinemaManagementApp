import { FlatList } from "react-native";
import CastItem from "../Casts/CastItem";

function Cast({ casts, route }) {
  return (
    <FlatList
      horizontal={false}
      numColumns={2}
      keyExtractor={(item) => item.id}
      data={casts}
      renderItem={(itemData) => {
        return <CastItem cast={itemData.item} />;
      }}
    />
  );
}
export default Cast;
