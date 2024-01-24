import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_TMDB_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
export const baseUrl = "https://image.tmdb.org/t/p/original";
export const baseYoutubeUrl = "https://www.youtube.com/watch?v=";
export const embedMovieUrl = `https://autoembed.co/movie/tmdb/`;
export const embedTvShowUrl = `https://autoembed.co/tv/tmdb/`;

const trendingMediaEndpoint = (type) =>
  `${BASE_URL}/trending/${type}/day?api_key=${API_KEY}&language=en-US`;
const popularMediaEndpoint = (type) =>
  `${BASE_URL}/${type}/popular?api_key=${API_KEY}&language=en-US`;
const topRatedMediaEndpoint = (type) =>
  `${BASE_URL}/${type}/top_rated?api_key=${API_KEY}&language=en-US`;
const searchMediaEndpoint = (type, query) =>
  `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=en-US&query=${query}`;

const mediaDetailsEndpoint = (type, id) =>
  `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`;
const movieContentRatingEndpoint = (id) =>
  `${BASE_URL}/movie/${id}/release_dates?api_key=${API_KEY}&language=en-US`;
const tvContentRatingEndpoint = (id) =>
  `${BASE_URL}/tv/${id}/content_ratings?api_key=${API_KEY}&language=en-US`;
const mediaVideosEndpoint = (type, id) =>
  `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`;
const mediaCreditsEndpoint = (type, id) =>
  `${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`;
const recommendedMediaEndpoint = (type, id) =>
  `${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}&language=en-US`;
const similarMediaEndpoint = (type, id) =>
  `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US`;
const TVEpisodeDetailsByIDandSeason = (id, season) =>
  `${BASE_URL}/tv/${id}/season/${season}?api_key=${API_KEY}&language=en-US`;

export const image500 = (posterPath) =>
  posterPath ? "https://image.tmdb.org/t/p/w500" + posterPath : null;
export const image342 = (posterPath) =>
  posterPath ? "https://image.tmdb.org/t/p/w342" + posterPath : null;
export const image185 = (posterPath) =>
  posterPath ? "https://image.tmdb.org/t/p/w185" + posterPath : null;

export const fallbackMoviePoster =
  "https://github.com/rishabh1S/muvo/blob/main/public/images/no-poster.png?raw=true";
export const fallbackPersonImage =
  "https://github.com/rishabh1S/muvo/blob/main/public/images/avatar.png?raw=true";

const apiCall = async (endpoint, params = {}) => {
  const options = {
    method: "GET",
    url: endpoint,
    params: params ? params : {},
  };

  try {
    const response = await axios.request(options);
    return response.data || {};
  } catch (error) {
    console.log("error: ", error);
    return {};
  }
};

export const fetchTrendingMedias = (type) => {
  return apiCall(trendingMediaEndpoint(type));
};
export const fetchPopularMedias = (type) => {
  return apiCall(popularMediaEndpoint(type));
};
export const fetchTopRatedMedias = (type) => {
  return apiCall(topRatedMediaEndpoint(type));
};

export const fetchTVorMovieDetailsByID = (type, id) => {
  return apiCall(mediaDetailsEndpoint(type, id));
};
export const fetchMovieContentRatingByID = (id) => {
  return apiCall(movieContentRatingEndpoint(id));
};
export const fetchTvContentRatingByID = (id) => {
  return apiCall(tvContentRatingEndpoint(id));
};
export const fetchTVorMovieVideosByID = (type, id) => {
  return apiCall(mediaVideosEndpoint(type, id));
};
export const fetchTVorMovieCreditsByID = (type, id) => {
  return apiCall(mediaCreditsEndpoint(type, id));
};
export const fetchRecommendedTVorMovies = (type, id) => {
  return apiCall(recommendedMediaEndpoint(type, id));
};
export const fetchSimilarTVorMovies = (type, id) => {
  return apiCall(similarMediaEndpoint(type, id));
};

export const fetchTVorMovieSearchResults = (type, query) => {
  return apiCall(searchMediaEndpoint(type, query));
};

export const fetchTvEpisodeDetails = (id, season) => {
  return apiCall(TVEpisodeDetailsByIDandSeason(id, season));
};
