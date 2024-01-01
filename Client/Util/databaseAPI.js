import axios from "axios";
const BASE_URL = "https://cinema-ticket-booking-server.up.railway.app";
export async function GetMovieScheduleById(movieId) {
  var res = await axios
    .get(
      `${BASE_URL}/showtimes/in-the-next-7-days-from-today?movie-id=${movieId}`
    )
    .then((response) => {
      return response.data.result;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}

export async function GetMenuOfCinema(cinemaId) {
  var res = await axios
    .post(`${BASE_URL}/select/matching-properties/menus`, {
      cinemaId: cinemaId,
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
export async function GetPriceOfMovie(movieId) {
  console.log("movieId: ", movieId);

  var res = await axios
    .post(`${BASE_URL}/select/matching-properties/showtimes`, {
      movieId: movieId,
    })
    .then((response) => {
      if (response.data?.length > 0) {
        console.log("GetPriceOfMovie: ", response.data);
        return response.data[0].price;
      }
      return 10.32;
    })
    .catch((err) => {
      console.log("GetPriceOfMovie err: ", err);
      return null;
    });
  return res;
}

export async function GetAvailableSeatByShowTimeId(showtimeId) {
  var res = await axios
    .get(`${BASE_URL}/seats/available?showtime-id=${showtimeId}`)
    .then((response) => {
      return response.data.seats;
    })
    .catch((err) => {
      console.log("GetAvailableSeatByShowTimeId err: ", err);
      return null;
    });
  // console.log("GetAvailableSeatByShowTimeId:", res);
  return res;
}

export async function Login(user) {
  const loginUser = {
    userName: user.userName,
    // email: user.email,
    // phoneNumber: user.phoneNumber,
    password: user.password,
  };
  var response = await axios
    .post(`${BASE_URL}/api/Auth/login`, loginUser)
    .then((res) => {
      return {
        accessToken: res.data.token,
        refreshToken:
          "Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwidXNlck5hbWUiOiJhZG1pbiIsInJvbGUiOnsiaWQiOiIzIiwicm9sZU5hbWUiOiJBZG1pbiJ9LCJpYXQiOjE3MDM1ODMzMjgsImV4cCI6MTcxMTM1OTMyOH0.2rWaZrE78mUd4kuC6GczElJ96eAJ9pJCdmgtdwJemCA",
        // userId: res.data.userId,
        userId: res.data.user_id,
        roleId: res.data.user_role, //1 - customer, 2 - employee
        userName: res.data.username,
        idPosition: "1",
      };
    })
    .catch((err) => {
      console.log("Login Error: " + err);
      return null;
    });
  // if (response !== null) {
  //   const refresh = await ResetToken(response);
  //   response.accessToken = refresh.accessToken;
  //   response.refreshToken = refresh.refreshToken;
  // }

  return response;
}

export async function CreateNewBill(newBill, paid = false) {
  console.log("newBill: " + newBill);
  newBill.paid = paid;
  var res = await axios
    .post(`${BASE_URL}/bills/new`, newBill)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("CreateNewBill err: ", err);
      return null;
    });
  return res;
}

export async function GetAllCinemas() {
  var res = await axios
    .get(`${BASE_URL}/select/entire/cinemas?page-size=20&page-number=1`)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("GetAllCinemas err: ", err);
      return null;
    });
  return res;
}

export async function GetMovieScheduleByCinemaId(cinemaId) {
  var res = await axios
    .get(
      `${BASE_URL}/showtimes/in-the-next-7-days-from-today-of-one-cinema?cinema-id=${cinemaId}`
    )
    .then((response) => {
      return response.data.result;
    })
    .catch((err) => {
      console.log("GetMovieScheduleByCinemaId err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}

export async function UpdateUserInformation(userId, updateValue) {
  var res = await axios
    .put(`${BASE_URL}/update/matching-properties/users`, {
      matching: {
        id: userId,
      },
      updatedValue: updateValue,
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("updateUserInformation err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
export async function GetCurrentUserInformation(userId) {
  console.log(userId);
  var res = await axios
    .post(`${BASE_URL}/select/matching-properties/users`, {
      id: userId,
    })
    .then((response) => {
      if (response?.data?.length > 0) {
        return response.data[0];
      }
      return null;
    })
    .catch((err) => {
      console.log("GetCurrentUserInformation err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
export async function changePassword(userId, oldPassword, newPassword) {
  console.log(userId, oldPassword, newPassword);
  var isExist = await checkOldPassword(userId, oldPassword);
  if (isExist) {
    var res = await UpdateUserInformation(userId, { password: newPassword });
    if (res) {
      return 1;
    }
    return null;
  } else {
    return 0;
  }
}
export async function checkOldPassword(userId, oldPassword) {
  var res = await axios
    .post(`${BASE_URL}/select/matching-properties/users`, {
      id: userId,
      password: oldPassword,
    })
    .then((response) => {
      if (response?.data?.length > 0) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.log("checkOldPassword err: ", err);
      return false;
    });
  // console.log(res);
  return res;
}

export async function GetAllBillOfUser(userId, checked = false) {
  var res = await axios
    .get(
      `${BASE_URL}/bills/old/all?user-id=${userId}&tickets-checked=${checked}`
    )
    .then((response) => {
      return response.data.result;
    })
    .catch((err) => {
      console.log("GetAllBillOfUser err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
export async function GetAllBillOfUserV2(userId) {
  var res = await axios
    .get(`${BASE_URL}/bills/old/all?user-id=${userId}`)
    .then((response) => {
      return response.data.result;
    })
    .catch((err) => {
      console.log("GetAllBillOfUserV2 err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
export async function GetAllDiscountOfUser(userId) {
  console.log("userId:", typeof parseInt(userId));
  var res = await axios
    .post(`${BASE_URL}/select/matching-properties/discounts-users`, {
      userId: parseInt(userId),
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log("GetAllDiscountOfUser err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
export async function Register(user) {
  const registerUser = {
    username: user.username,
    email: user.email ? user.email : "",
    phoneNumber: user.phoneNumber ? user.phoneNumber : "",
    password: user.password,
    role: "1",
  };

  var response = await axios.post(
    `${BASE_URL}/api/Auth/registerEmployee`,
    registerUser
  );
  return response;
}
export async function CheckEmailExist(email) {
  var res = await axios
    .post(`${BASE_URL}/select/matching-properties/users`, {
      email: email,
    })
    .then((response) => {
      if (response?.data?.length > 0) {
        return response?.data[0];
      }
      return false;
    })
    .catch((err) => {
      console.log("CheckEmailExist err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
export async function CheckPhoneNumberExist(phoneNumber) {
  var res = await axios
    .post(`${BASE_URL}/select/matching-properties/users`, {
      phoneNumber: phoneNumber,
    })
    .then((response) => {
      if (response?.data?.length > 0) {
        return response?.data[0];
      }
      return false;
    })
    .catch((err) => {
      console.log("CheckPhoneNumberExist err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
export async function CheckUserNameExist(username) {
  var res = await axios
    .post(`${BASE_URL}/select/matching-properties/users`, {
      username: username,
    })
    .then((response) => {
      if (response?.data?.length > 0) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      console.log("CheckUserNameExist err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
export async function ResetPasswordForUser(username, newPassword) {
  console.log(username, newPassword);
  var res = await axios
    .get(
      `${BASE_URL}/api/Auth/forgot-password?username=${username}&newPassword=${newPassword}&confirmPassword=${newPassword}`
    )
    .then((response) => {
      return true;
    })
    .catch((err) => {
      console.log("ResetPasswordForUser err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
