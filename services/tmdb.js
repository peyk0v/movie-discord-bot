require("dotenv").config();
const axios = require("axios");
const { FetchTMDBException } = require('../exceptions/fetchDataException')

const baseUrl = process.env.BASE_TMDB_URL;
const baseImageUrl = process.env.BASE_TMDB_URL_IMAGE
const apiKey = process.env.API_KEY;

async function getMovieData(id) {
  try {
    const details = await getMovieDetails(id)
    const credits = await getMovieCredits(id)
    const wrappedData = wrapMovieData(details, credits)
    return wrappedData
  } catch {
    throw new FetchTMDBException()
  }
}

function getMovieDetails(id) {
  return axios 
    .get(baseUrl + `/movie/${id}?api_key=${apiKey}`)
    .then((response) => {
      return response.data;
    });
}

function getMovieCredits(id) {
  return axios
    .get(baseUrl + `/movie/${id}/credits?api_key=${apiKey}`)
    .then(response => {
      return response.data
    })
}

function wrapMovieData(details, credits) {
  return {
    title: details.title,
    release_date: details.release_date,
    directors: getDirectors(credits.crew),
    vote_average: details.vote_average.toString(),
    image_url: baseImageUrl + details.poster_path,
    main_director: getMainDirectorData(credits.crew),
    genres: getGenresAsArray(details)
  }
}

function getDirectors(crew) {
  let directors = []
  crew.forEach(c => {
    if (c.job === "Director") {
      directors.push(c.name)
    }
  })
  return directors;
}

function getMainDirectorData(crew) {
  let director = new Object()
  crew.forEach(c => {
    if (c.job === "Director") {
      director.name = c.name
      director.image = getDirectorImage(c.profile_path)
      return director
    }
  })
  return director;
}

function getDirectorImage(profile_path) {
  if(profile_path !== null) {
    return baseImageUrl + profile_path
  } else {
    return process.env.ANONYMOUS_DIRECTOR_URL
  }
}

function getGenresAsArray(details) {
  return details.genres.map(genre => genre.name)
}

module.exports = getMovieData;
