import axios from "axios";

const baseURL = "https://productcatalog123.azurewebsites.net";

const showtimeService = axios.create({
  baseURL,
});

export const getAllShowtimes = async () => {
  try {
    const response = await showtimeService.get(
      "/select/entire/showtimes?page-size=1000&page-number=1"
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching showtime:", error);
    throw error;
  }
};

export const getShowtimeById = async (idData) => {
    try {
      const response = await showtimeService.post(
        "/select/matching-properties/showtimes", 
        idData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching showtime:", error);
      throw error;
    }
  };

export const createShowtime = async (newMenuData) => {
    console.log(newMenuData);
  try {
    const response = await showtimeService.post(
      "/insert/just-one/showtimes",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating showtime:", error);
    throw error;
  }
};

export const updateShowtime = async (newMenuData) => {
  try {
    const response = await showtimeService.put(
      "/Update/matching-properties/showtimes",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating showtime:", error);
    throw error;
  }
};

export const deleteShowtime = async (id) => {
  await axios
    .delete(baseURL + "/delete/matching-properties/showtimes", { data: id })
    .then((response) => {
      // Handle success
      console.log("Delete successful", response);
    })
    .catch((error) => {
      // Handle error
      console.error("Delete error", error);
    });
};
