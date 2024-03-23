// Imports
import { getWeatherByLocationAndDate } from "../utils/weather_api.js";
import { getDistanceInKmBySrcAndDestnCoordinates } from "../utils/distance_api.js";

// Constants/Body
/**
 * @param {any} eventToFill Event to fill
 * @param {number} distanceSrcLat Distance Source Latitude
 * @param {number} distanceSrcLong Distance Source Longitude
 * @returns {Promise<any | null>} Filled event
 */
export async function fillEventWithWeatherAndDistance(
  eventToFill,
  distanceSrcLat,
  distanceSrcLong,
) {
  try {
    const distanceDestLat = eventToFill.coordinates[1];
    const distanceDestLong = eventToFill.coordinates[0];

    const weatherAndDistancePromises = [
      getWeatherByLocationAndDate(eventToFill.city_name, eventToFill.date),
      getDistanceInKmBySrcAndDestnCoordinates(
        distanceSrcLat,
        distanceSrcLong,
        distanceDestLat,
        distanceDestLong,
      ),
    ];
    const weatherAndDistance = await Promise.all(weatherAndDistancePromises);

    const weather = weatherAndDistance[0];
    const distance = weatherAndDistance[1];

    return {
      ...eventToFill,
      weather,
      distance_km: distance,
    };
  } catch (error) {
    console.error("[services/events]", error);
    return null;
  }
}
