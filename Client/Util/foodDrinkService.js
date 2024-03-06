import axios from "axios";

const baseURL = "https://productcatalog123.azurewebsites.net";

const foodDrinkService = axios.create({
  baseURL,
});

export const getAllFoodDrinks = async () => {
  try {
    const response = await foodDrinkService.get(
      "/select/entire/food-and-drinks?page-size=100&page-number=1"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching foodDrinks:", error);
    throw error;
  }
};

export const createFoodDrink = async (newFDData) => {
  try {
    const response = await foodDrinkService.post(
      "/insert/just-one/food-and-drinks",
      newFDData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating food drink:", error);
    throw error;
  }
};

export const updateFoodDrink = async (newFDData) => {
  try {
    const response = await foodDrinkService.put(
      "/Update/matching-properties/food-and-drinks",
      newFDData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating food drink:", error);
    throw error;
  }
};

export const deleteFoodDrink = async (id) => {
  axios
    .delete(baseURL + "/delete/matching-properties/food-and-drinks", { data: id })
    .then((response) => {
      // Handle success
      console.log("Delete successful", response);
    })
    .catch((error) => {
      // Handle error
      console.error("Delete error", error);
    });
};
