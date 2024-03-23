// Constants/Body
/**
 * @param {Date} indianDateToConvert Indian Date to convert
 * @returns {Date} Converted Zulu Date
 */
export function convertIndianDateToZuluDate(indianDateToConvert) {
  const sameIndianDate = new Date(indianDateToConvert);
  sameIndianDate.setHours(sameIndianDate.getHours() - 5);
  sameIndianDate.setMinutes(sameIndianDate.getMinutes() - 30);

  return sameIndianDate;
}
