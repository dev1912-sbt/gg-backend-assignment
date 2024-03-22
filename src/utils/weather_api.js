// Imports
import axios from "axios";

// Constants
export const API_CODE =
  "KfQnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==";

// Body
/**
 * @param {string} cityName City name
 * @param {Date} date Date
 * @returns {Promise<string | null>} Weather
 */
export async function getWeatherByLocationAndDate(cityName, date) {
  const urlEncodedCityName = encodeURIComponent(cityName);
  const dateStr = date.toISOString().split("T")[0];

  try {
    const apiUrl = `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=${API_CODE}&city=${urlEncodedCityName}&date=${dateStr}`;
    const apiResponse = await axios.get(apiUrl);
    const apiResponseData = apiResponse.data;

    const weather = apiResponseData.weather;
    return weather;
  } catch (error) {
    console.error("[weather_api]", error.message ?? error);
    return null;
  }
}
