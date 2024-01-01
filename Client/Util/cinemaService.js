import axios from "axios";

const baseURL = "https://cinema-ticket-booking-server.up.railway.app";

const cinemaService = axios.create({
  baseURL,
});

export const getAllCinemas = async () => {
  try {
    const response = await cinemaService.get(
      "/select/entire/cinemas?page-size=100&page-number=1"
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching cinemas:", error);
    throw error;
  }
};

export const getCinemaById = async (idData) => {
    try {
      const response = await cinemaService.post(
        "/select/matching-properties/cinemas", 
        idData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching cinema:", error);
      throw error;
    }
  };

export const createCinema = async (newMenuData) => {
  try {
    const response = await cinemaService.post(
      "/insert/just-one/cinemas",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating cinema:", error);
    throw error;
  }
};

export const updateCinema = async (newMenuData) => {
  try {
    const response = await cinemaService.put(
      "/Update/matching-properties/cinemas",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cinema:", error);
    throw error;
  }
};

export const deleteCinema = async (id) => {
  await axios
    .delete(baseURL + "/delete/matching-properties/cinemas", { data: id })
    .then((response) => {
      // Handle success
      console.log("Delete successful", response);
    })
    .catch((error) => {
      // Handle error
      console.error("Delete error", error);
    });
};
