import axios from "axios";

const baseURL = "https://cinema-ticket-booking-server.up.railway.app";

const statisticService = axios.create({
  baseURL,
});

export const getAllTopMovies = async () => {
  try {
    const response = await statisticService.get(
      "/movies/top-10/year?year=2023"
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching top movie:", error);
    throw error;
  }
};

export const getRevenue = async () => {
  try {
    const response = await statisticService.get(
      "/statistic/revenue-12-months-of-year-of-all-cinema?year=2023"
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching revenue:", error);
    throw error;
  }
}