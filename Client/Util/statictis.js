import axios from "axios";

const baseURL = "https://productcatalog123.azurewebsites.net";

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

export const getRevenue = async (year) => {
  console.log(year);
  try {
    const response = await statisticService.get(
      `/statistic/revenue-12-months-of-year-of-all-cinema?year=${year}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching revenue:", error);
    throw error;
  }
}