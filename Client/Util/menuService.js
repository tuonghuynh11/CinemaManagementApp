import axios from "axios";

const baseURL = "https://productcatalog123.azurewebsites.net";

const menuService = axios.create({
  baseURL,
});

export const getAllMenu = async () => {
  try {
    const response = await menuService.get(
      "/select/entire/menus?page-size=1000&page-number=1"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching menus:", error);
    throw error;
  }
};

export const createMenu = async (newMenuData) => {
  console.log(newMenuData);
  try {
    const response = await menuService.post(
      "/insert/just-one/menus",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.log("Error creating menu:", error);
    throw error;
  }
};

export const updateMenu = async (newMenuData) => {
  console.log(newMenuData)
  try {
    const response = await menuService.put(
      "/Update/matching-properties/menus",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating menu:", error);
    throw error;
  }
};

export const deleteMenu = async (id) => {
  axios
    .delete(baseURL + "/delete/matching-properties/menus", { data: id })
    .then((response) => {
      // Handle success
      console.log("Delete successful", response);
    })
    .catch((error) => {
      // Handle error
      console.error("Delete error", error);
    });
};
