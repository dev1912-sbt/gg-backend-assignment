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

/**
 * @param {Date} date Date
 * @param {number} days Days to add to Date
 * @returns {Date} Result date
 */
export function addDaysToDate(date, days) {
  const sameDate = new Date(date);
  sameDate.setDate(sameDate.getDate() + days);

  return sameDate;
}
