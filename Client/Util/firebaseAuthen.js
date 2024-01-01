import axios from "axios";
const API_KEY = "AIzaSyBQ7aSitkA2S2aM6iZma1POL3zllMb47Pc";
export async function authenticate(mode, email, password) {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`,
    {
      email: email,
      password: password,
      returnSecureToken: true,
    }
  );
  //   console.log(response.data);
  const data = response.data;
  return data;
}
export function createUser(email, password) {
  return authenticate("signUp", email, password);
}
export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}
