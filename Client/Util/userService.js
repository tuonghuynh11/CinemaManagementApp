import axios from "axios";

const baseURL = "https://productcatalog123.azurewebsites.net";

const userService = axios.create({
  baseURL,
});

export const getAllUsers = async () => {
  try {
    const response = await userService.get(
      "/select/entire/users?page-size=100&page-number=1"
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (idData) => {
    try {
      const response = await userService.post(
        "/select/matching-properties/users", 
        idData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

export const createUser = async (newMenuData) => {
    //console.log(newMenuData);
  try {
    const response = await userService.post(
      "/insert/just-one/users",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateAUser = async (newMenuData) => {
  //console.log(newMenuData);
  try {
    const response = await userService.put(
      "/Update/matching-properties/users",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  await axios
    .delete(baseURL + "/delete/matching-properties/users", { data: id })
    .then((response) => {
      // Handle success
      console.log("Delete successful", response);
    })
    .catch((error) => {
      // Handle error
      console.error("Delete error", error);
    });
};
