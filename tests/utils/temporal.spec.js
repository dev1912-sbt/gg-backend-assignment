import { expect } from "chai";
import { convertIndianDateToZuluDate } from "../../src/utils/temporal.js";

describe("utils/temporal.js", () => {
  describe("convertIndianDateToZuluDate()", () => {
    it("converts indian date to zulu date", () => {
      const indianDate = new Date("2024-03-14T12:00:00+05:30");
      const expectedZuluDate = new Date("2024-03-14T06:30:00+05:30");

      const zuluDate = convertIndianDateToZuluDate(indianDate);

      expect(zuluDate.getTime()).to.be.equal(expectedZuluDate.getTime());
    });
  });
});
