import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_TMDB_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
export const baseUrl = "https://image.tmdb.org/t/p/original";
export const baseYoutubeUrl = "https://www.youtube.com/watch?v=";
export const embedMovieUrl = `https://www.2embed.cc/embed/`;
export const embedTvShowUrl = `https://www.2embed.cc/embedtv/`;

const trendingMediaEndpoint = (type: string) =>
  `${BASE_URL}/trending/${type}/day?api_key=${API_KEY}&language=en-US`;
const popularMediaEndpoint = (type: string) =>
  `${BASE_URL}/${type}/popular?api_key=${API_KEY}&language=en-US`;
const topRatedMediaEndpoint = (type: string) =>
  `${BASE_URL}/${type}/top_rated?api_key=${API_KEY}&language=en-US`;
const searchMediaEndpoint = (type: string, query: string) =>
  `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=en-US&query=${query}`;

const mediaDetailsEndpoint = (type: string, id: string) =>
  `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`;
const mediaCreditsEndpoint = (type: string, id: string) =>
  `${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`;
const recommendedMediaEndpoint = (type: string, id: string) =>
  `${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}&language=en-US`;
const similarMediaEndpoint = (type: string, id: string) =>
  `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US`;

export const image500 = (posterPath: string) =>
  posterPath ? "https://image.tmdb.org/t/p/w500" + posterPath : null;
export const image342 = (posterPath: string) =>
  posterPath ? "https://image.tmdb.org/t/p/w342" + posterPath : null;
export const image185 = (posterPath: string) =>
  posterPath ? "https://image.tmdb.org/t/p/w185" + posterPath : null;

export const fallbackMoviePoster =
  "https://github.com/rishabh1S/muvo/blob/main/public/images/no-poster.png?raw=true";
export const fallbackPersonImage =
  "https://github.com/rishabh1S/muvo/blob/main/public/images/avatar.png?raw=true";

const apiCall = async (endpoint: string, params: object = {}) => {
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

export const fetchTrendingMedias = (type: string) => {
  return apiCall(trendingMediaEndpoint(type));
};
export const fetchPopularMedias = (type: string) => {
  return apiCall(popularMediaEndpoint(type));
};
export const fetchTopRatedMedias = (type: string) => {
  return apiCall(topRatedMediaEndpoint(type));
};

// movie screen apis
export const fetchTVorMovieDetailsByID = (type: string, id: string) => {
  return apiCall(mediaDetailsEndpoint(type, id));
};
export const fetchTVorMovieCreditsByID = (type: string, id: string) => {
  return apiCall(mediaCreditsEndpoint(type, id));
};
export const fetchRecommendedTVorMovies = (type: string, id: string) => {
  return apiCall(recommendedMediaEndpoint(type, id));
};
export const fetchSimilarTVorMovies = (type: string, id: string) => {
  return apiCall(similarMediaEndpoint(type, id));
};

export const fetchTVorMovieSearchResults = (type: string, query: string) => {
  return apiCall(searchMediaEndpoint(type, query));
};
