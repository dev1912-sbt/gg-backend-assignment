// Imports
import axios from "axios";

// Constants
export const API_CODE =
  "IAKvV2EvJa6Z6dEIUqqd7yGAu7IZ8gaH-a0QO6btjRc1AzFu8Y3IcQ==";

// Body
/**
 * @param {number} srcLat Source Latitude
 * @param {number} srcLong Source Longitude
 * @param {number} destLat Destination Latitude
 * @param {number} destLong Destination Longitude
 * @returns {Promise<string | null>} Distance in Kilometres
 */
export async function getDistanceInKmBySrcAndDestnCoordinates(
  srcLat,
  srcLong,
  destLat,
  destLong,
) {
  try {
    const apiUrl = `https://gg-backend-assignment.azurewebsites.net/api/Distance?code=${API_CODE}&latitude1=${srcLat}&longitude1=${srcLong}&latitude2=${destLat}&longitude2=${destLong}`;
    const apiResponse = await axios.get(apiUrl);
    const apiResponseData = apiResponse.data;

    const distance = apiResponseData.distance;
    return distance;
  } catch (error) {
    console.error("[distance_api]", error.message ?? error);
    return null;
  }
}
