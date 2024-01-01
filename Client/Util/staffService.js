import axios from "axios";

const baseURL = "https://cinema-ticket-booking-server.up.railway.app";

const staffService = axios.create({
  baseURL,
});

export const getAllStaffs = async () => {
  try {
    const response = await staffService.get(
      "/select/entire/staffs?page-size=100&page-number=1"
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching staffs:", error);
    throw error;
  }
};

export const getStaffById = async (idData) => {
    try {
      const response = await staffService.post(
        "/select/matching-properties/staffs", 
        idData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching staff:", error);
      throw error;
    }
  };

export const createStaff = async (newMenuData) => {
    console.log(newMenuData);
  try {
    const response = await staffService.post(
      "/insert/just-one/staffs",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating staff:", error);
    throw error;
  }
};

export const updateAStaff = async (newMenuData) => {
  console.log(newMenuData);
  try {
    const response = await staffService.put(
      "/Update/matching-properties/staffs",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};

export const deleteStaff = async (id) => {
  await axios
    .delete(baseURL + "/delete/matching-properties/staffs", { data: id })
    .then((response) => {
      // Handle success
      console.log("Delete successful", response);
    })
    .catch((error) => {
      // Handle error
      console.error("Delete error", error);
    });
};
