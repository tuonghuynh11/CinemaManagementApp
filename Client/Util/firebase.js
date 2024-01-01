import axios from "axios";
import { Movie } from "../Models/Movie";
import { getMovieDetailById } from "../Services/httpService";
import { Ticket } from "../Models/Ticket";
const API_KEY = "AIzaSyDCAQWkKcZt4uCZOL5FPvb-5nNFY90lVVI";
const BASE_URL = "https://movieapp-5f4de-default-rtdb.firebaseio.com/";
export function addNewUser(uid, email) {
  const response = axios
    .post(BASE_URL + `Users/${uid}.json`, {
      id: uid,
      email: email,
    })
    .then((response) => {
      axios.put(BASE_URL + `Users/${uid}.json`, {
        id: uid,
        email: email,
      });
    });
  return response;
}
export function addMovieToWatchList(uid, idMovie) {
  const response = axios
    .post(BASE_URL + `WatchLists/${uid}/${idMovie}.json`, {
      idMovie,
    })
    .then((response) => {
      axios.put(BASE_URL + `WatchLists/${uid}/${idMovie}.json`, {
        idMovie,
      });
    });

  return response;
}
export async function addNewTicket(ticket) {
  const response = await axios
    .post(BASE_URL + `TicketsBooking/${ticket.idUser}/${ticket.id}.json`, {
      ...ticket,
    })
    .then((response) => {
      axios.put(
        BASE_URL + `TicketsBooking/${ticket.idUser}/${ticket.id}.json`,
        {
          ...ticket,
        }
      );
    });

  return response;
}
export function deleteMovieInWatchList(uid, idMovie) {
  const response = axios.delete(BASE_URL + `WatchLists/${uid}/${idMovie}.json`);

  return response;
}
export function deleteTicketOfUser(uid, idTicket) {
  const response = axios.delete(
    BASE_URL + `TicketsBooking/${uid}/${idTicket}.json`
  );

  return response;
}
export function deleteUser(uid) {
  const response = axios.delete(BASE_URL + `Users/${uid}.json`);

  return response;
}

export async function fetchWatchList(uid) {
  const response = await axios.get(BASE_URL + `WatchLists/${uid}.json`);
  const watchList = [];
  for (const key in response.data) {
    await getMovieDetailById(key).then((item) => {
      const movie = new Movie(
        item.id,
        item.title,
        item.overview,
        item.runtime,
        item.vote_average,
        item.poster_path,
        item.release_date,
        [...item?.genres]
      );
      watchList.push(movie);
    });
  }
  return watchList;
}

export async function fetchTickets(uid) {
  const response = await axios.get(BASE_URL + `TicketsBooking/${uid}.json`);
  const tickets = [];
  for (const key in response.data) {
    if (response.data[key] === null) continue;
    const ticket = new Ticket(
      key,
      uid,
      response.data[key].idMovie,
      response.data[key].movieImage,
      response.data[key].row,
      response.data[key].hall,
      response.data[key].date,
      response.data[key].time,
      response.data[key].seats
    );
    tickets.push(ticket);
  }

  return tickets;
}
