import axios from "axios";

const baseURL = "https://cinema-ticket-booking-server.up.railway.app";

const movieService = axios.create({
  baseURL,
});

export const getAllMovie = async () => {
  try {
    const response = await movieService.get(
      "/select/entire/movies?page-size=1000&page-number=1"
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching movies:", error);
    throw error;
  }
};

export const deleteMovie = async (id) => {
  axios
    .delete(baseURL + "/delete/matching-properties/movies", { data: id })
    .then((response) => {
      // Handle success
      console.log("Delete successful", response);
    })
    .catch((error) => {
      // Handle error
      console.error("Delete error", error);
    });
};

export const createMovie = async (newFDData) => {
  console.log(newFDData);
  try {
    const response = await movieService.post(
      "/insert/just-one/movies",
      newFDData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating movie:", error);
    throw error;
  }
};