export class Ticket {
  constructor(id, idUser, idMovie, movieImage, row, hall, date, time, seats) {
    this.id = id;
    this.idMovie = idMovie;
    this.idUser = idUser;
    this.movieImage = movieImage;
    this.date = date;
    this.time = time;
    this.seats = seats;
    this.row = row;
    this.hall = hall;
  }
}
