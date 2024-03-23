import { expect } from "chai";
import {
  convertIndianDateToZuluDate,
  addDaysToDate,
} from "../../src/utils/temporal.js";

describe("utils/temporal.js", () => {
  describe("convertIndianDateToZuluDate()", () => {
    it("converts indian date to zulu date", () => {
      const indianDate = new Date("2024-03-14T12:00:00+05:30");
      const expectedZuluDate = new Date("2024-03-14T06:30:00+05:30");

      const zuluDate = convertIndianDateToZuluDate(indianDate);

      expect(zuluDate.getTime()).to.be.equal(expectedZuluDate.getTime());
    });
  });

  describe("addDaysToDate()", () => {
    it("adds days to date", () => {
      const date = new Date("2024-03-14T12:00:00Z");
      const expectedResultDateAfter14Days = new Date("2024-03-28T12:00:00Z");

      const resultDate = addDaysToDate(date, 14);

      expect(resultDate.getTime()).to.be.equal(
        expectedResultDateAfter14Days.getTime(),
      );
    });
  });
});
