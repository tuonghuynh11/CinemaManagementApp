import axios from "axios";

const baseURL = "https://productcatalog123.azurewebsites.net";

const audiService = axios.create({
  baseURL,
});

export const getAllAuditoriums = async () => {
  try {
    const response = await audiService.get(
      "/select/entire/auditoriums?page-size=100&page-number=1"
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching auditoriums:", error);
    throw error;
  }
};

export const getAuditoriumById = async (idData) => {
    try {
      const response = await audiService.post(
        "/select/matching-properties/auditoriums", 
        idData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching auditorium:", error);
      throw error;
    }
  };

export const createAuditorium = async (newMenuData) => {
    console.log(newMenuData);
  try {
    const response = await audiService.post(
      "/insert/just-one/auditoriums",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating auditorium:", error);
    throw error;
  }
};

export const updateAuditorium = async (newMenuData) => {
  try {
    const response = await audiService.put(
      "/Update/matching-properties/auditoriums",
      newMenuData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating auditorium:", error);
    throw error;
  }
};

export const deleteAuditorium = async (id) => {
  await axios
    .delete(baseURL + "/delete/matching-properties/auditoriums", { data: id })
    .then((response) => {
      // Handle success
      console.log("Delete successful", response);
    })
    .catch((error) => {
      // Handle error
      console.error("Delete error", error);
    });
};
