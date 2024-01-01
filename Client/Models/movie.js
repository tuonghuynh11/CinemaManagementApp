export class Movie {
  constructor(
    id,
    title,
    overview,
    runtime,
    vote_average,
    poster_path,
    release_date,
    categories,
    price,
    backdrop_path,
    spoken_languages
  ) {
    this.id = id;
    this.title = title;
    this.overview = overview;
    this.runtime = runtime;
    this.vote_average = vote_average;
    this.poster_path = poster_path;
    this.release_date = release_date;
    this.categories = [...categories];
    this.price = price;
    this.backdrop_path = backdrop_path;
    this.spoken_languages = spoken_languages;
  }
}
