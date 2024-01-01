import axios from "axios";
import { Movie } from "../Models/Movie";
import { Comment } from "../Models/Comment";
import { Cast } from "../Models/Cast";
import { GetPriceOfMovie } from "../Util/databaseAPI";

const BASE_URL = "https://api.themoviedb.org/3/movie/";
const BASE_URL_SEARCH = "https://api.themoviedb.org/3/search/movie?query=";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYThiYzY5MzBmYjQ2ZTAxYmFmZTRkNDJhOGY4OWE2NiIsInN1YiI6IjY0MWM1YTYzMjRiMzMzMDBkNzI2MDQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6PmEyqlyAb6rgUsHzTXBopALplnBcDCJS7Al3z1v3E",
  },
};
async function getMovie(type, page = 1) {
  var moviesType = `${type}?language=en-US&page=${page}`;
  var response = await axios
    .get(BASE_URL + moviesType, options)
    .catch((error) => {});
  return response !== null ? response.data.results.slice(0, 10) : null;
}
export async function getMovieDetailById(movieId) {
  var movieId = `${movieId}?language=en-US`;
  var response = await axios
    .get(BASE_URL + movieId, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  // if (response) {
  //   const price = await GetPriceOfMovie(response.data.id);
  //   return { ...response.data, price: price };
  // }
  return response !== null ? response.data : null;
}
export async function searchMovies(movieName, page = 1) {
  var movieId = `${movieName}&include_adult=false&language=en-US&page=${page}`;

  var response = await axios
    .get(BASE_URL_SEARCH + movieId, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  // var response = await axios.get(BASE_URL_SEARCH + movieId, options);
  let movies = [];
  if (response !== null) {
    var quantity = 0;
    for (const item of response.data.results) {
      if (quantity == 10) {
        break;
      }
      await getMovieDetailById(item.id).then((movieDetail) => {
        try {
          movies.push(
            new Movie(
              movieDetail.id,
              movieDetail.title,
              movieDetail.overview,
              movieDetail.runtime,
              movieDetail.vote_average,
              movieDetail.poster_path,
              movieDetail.release_date,
              [...movieDetail.genres],
              movieDetail.price,
              movieDetail.backdrop_path,
              movieDetail.spoken_languages
            )
          );
        } catch (error) {
          console.log(error);
        }
      });
      quantity++;
    }
    // response.data.results.forEach((item, index) => {
    //   movies.push(
    //     new Movie(
    //       item.id,
    //       item.title,
    //       item.overview,
    //       "0",
    //       item.vote_average,
    //       item.poster_path,
    //       item.release_date,
    //       [...item?.genre_ids]
    //     )
    //   );
    // });
  }

  return { movies: movies, totalPage: response.data.total_pages };
}
export async function getTrendMovie() {
  var moviesType = `https://api.themoviedb.org/3/trending/movie/day`;
  var response = await axios.get(moviesType, options).catch((error) => {
    console.log(error);
  });
  // console.log(response.data);
  return response !== null ? response.data.results : null;
}
export async function getNowPlayingMovies() {
  const moviesList = await getMovie("now_playing", 1).catch((error) => {});
  return moviesList;
}
export async function getPopularMovies() {
  const moviesList = await getMovie("popular", 1).catch((error) => {});
  return moviesList;
}
export async function getTopRatedMovies() {
  const moviesList = await getMovie("top_rated", 1).catch((error) => {});
  return moviesList;
}

export async function getUpcomingMovies() {
  const moviesList = await getMovie("upcoming", 1).catch((error) => {});
  return moviesList;
}
export async function getReviewsOfMovie(movieId) {
  var reviewUrl = `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`;
  var response = await axios
    .get(reviewUrl, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  let reviews = [];
  if (response !== null) {
    response.data.results.forEach((movie) => {
      reviews.push(
        new Comment(
          movie.id,
          movie.author_details.username,
          movie.author_details.avatar_path,
          movie.content,
          movie.author_details.rating
        )
      );
    });
  }

  return reviews;
}
export async function getCastOfMovie(movieId) {
  var reviewUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
  var response = await axios
    .get(reviewUrl, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  let cast = [];
  let director = {};
  if (response !== null) {
    response.data.cast.forEach((casts) => {
      cast.push(
        new Cast(
          casts.adult,
          casts.gender,
          casts.id,
          casts.known_for_department,
          casts.name,
          casts.original_name,
          casts.popularity,
          casts.profile_path,
          casts.cast_id,
          casts.character,
          casts.credit_id,
          casts.order
        )
      );
    });
    director = response.data.crew.find((item) => item.job === "Director");
  }

  return {
    cast: cast,
    director: director,
  };
}
export async function getTrailerOfMovie(movieId) {
  // console.log(movieId);
  var trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
  var response = await axios
    .get(trailerUrl, options)
    .then((response) => {
      // console.log(response.data);
      return response.data.results[0].key;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });

  return response ? response : "";
}
export async function getMovieWatchList() {
  var watchListUrl = `https://api.themoviedb.org/3/account/18490283/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc`;
  var response = await axios
    .get(watchListUrl, options)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      //console.log(error);
      return null;
    });
  let movies = [];
  if (response !== null) {
    response.data.results.forEach((item) => {
      movies.push(
        new Movie(
          item.id,
          item.title,
          item.overview,
          "0",
          item.vote_average,
          item.poster_path,
          item.release_date,
          [...item?.genre_ids]
        )
      );
    });
  }
  return movies;
}

export async function addMovieWatchList(movieId) {
  const option = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYThiYzY5MzBmYjQ2ZTAxYmFmZTRkNDJhOGY4OWE2NiIsInN1YiI6IjY0MWM1YTYzMjRiMzMzMDBkNzI2MDQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6PmEyqlyAb6rgUsHzTXBopALplnBcDCJS7Al3z1v3E",
    },
    body: JSON.stringify({
      media_type: "movie",
      media_id: movieId,
      watchlist: true,
    }),
  };
  var Url = `https://api.themoviedb.org/3/account/18490283/watchlist`;
  const response = fetch(Url, option)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
  // var response = await axios
  //   .post(Url, option)
  //   .then((response) => {
  //     return response;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     return null;
  //   });
  return response;
}
export async function deleteMovieWatchList(movieId) {
  const option = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYThiYzY5MzBmYjQ2ZTAxYmFmZTRkNDJhOGY4OWE2NiIsInN1YiI6IjY0MWM1YTYzMjRiMzMzMDBkNzI2MDQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6PmEyqlyAb6rgUsHzTXBopALplnBcDCJS7Al3z1v3E",
    },
    body: JSON.stringify({
      media_type: "movie",
      media_id: movieId,
      watchlist: false,
    }),
  };
  var Url = `https://api.themoviedb.org/3/account/18490283/watchlist`;
  // var response = await axios
  //   .post(Url, option)
  //   .then((response) => {
  //     return response;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     return null;
  //   });

  const response = fetch(Url, option)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
  return response;
}

export async function addRatingMovie(movieId, value) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/rating`;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYThiYzY5MzBmYjQ2ZTAxYmFmZTRkNDJhOGY4OWE2NiIsInN1YiI6IjY0MWM1YTYzMjRiMzMzMDBkNzI2MDQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-6PmEyqlyAb6rgUsHzTXBopALplnBcDCJS7Al3z1v3E",
    },
    body: `{"value":${value}}`,
  };

  const response = fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
  return response;
}
////////////VNPAY

export async function GetVNPAYLink(
  amount,
  bankCode = "NCB",
  orderDescription,
  language = "vn"
) {
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
      console.log("updateUserInformation err: ", err);
      return null;
    });
  // console.log(res);
  return res;
}
