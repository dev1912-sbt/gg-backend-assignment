import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("utils/distance_api.js", () => {
  describe("getDistanceInKmBySrcAndDestnCoordinates()", () => {
    let dummyAxiosResponse;
    let axiosGetStub;

    let consoleErrorStub;

    let API_CODE;
    let getDistanceInKmBySrcAndDestnCoordinates;

    beforeEach(async () => {
      dummyAxiosResponse = {
        data: {
          distance: "dummyDistance",
        },
      };

      consoleErrorStub = sinon.stub(console, "error");

      axiosGetStub = sinon.stub();
      const esmockImports = await esmock("../../src/utils/distance_api.js", {
        axios: {
          get: axiosGetStub,
        },
      });
      API_CODE = esmockImports.API_CODE;
      getDistanceInKmBySrcAndDestnCoordinates =
        esmockImports.getDistanceInKmBySrcAndDestnCoordinates;
    });

    afterEach(() => {
      sinon.restore();
    });

    it("gets the distance", async () => {
      axiosGetStub.resolves(dummyAxiosResponse);
      const dummySrcLat = "dummySrcLat";
      const dummySrcLong = "dummySrcLong";
      const dummyDestLat = "dummyDestLat";
      const dummyDestLong = "dummyDestLong";
      const expectedApiUrl = `https://gg-backend-assignment.azurewebsites.net/api/Distance?code=${API_CODE}&latitude1=${dummySrcLat}&longitude1=${dummySrcLong}&latitude2=${dummyDestLat}&longitude2=${dummyDestLong}`;
      const expectedDistance = "dummyDistance";

      const distance = await getDistanceInKmBySrcAndDestnCoordinates(
        dummySrcLat,
        dummySrcLong,
        dummyDestLat,
        dummyDestLong,
      );

      expect(axiosGetStub.calledWith(expectedApiUrl)).to.be.true;
      expect(distance).to.be.equal(expectedDistance);
    });

    it("displays error message and returns null if api request failed with an error message", async () => {
      const dummyErrorWithMessage = new Error("dummyErrorWithMessage");
      axiosGetStub.throws(dummyErrorWithMessage);
      const dummySrcLat = "dummySrcLat";
      const dummySrcLong = "dummySrcLong";
      const dummyDestLat = "dummyDestLat";
      const dummyDestLong = "dummyDestLong";
      const expectedApiUrl = `https://gg-backend-assignment.azurewebsites.net/api/Distance?code=${API_CODE}&latitude1=${dummySrcLat}&longitude1=${dummySrcLong}&latitude2=${dummyDestLat}&longitude2=${dummyDestLong}`;

      const distance = await getDistanceInKmBySrcAndDestnCoordinates(
        dummySrcLat,
        dummySrcLong,
        dummyDestLat,
        dummyDestLong,
      );

      expect(axiosGetStub.calledWith(expectedApiUrl)).to.be.true;
      expect(
        consoleErrorStub.calledWith("[distance_api]", "dummyErrorWithMessage"),
      ).to.be.true;
      expect(distance).to.be.null;
    });

    it("displays complete error message and returns null if api request failed without an error message", async () => {
      const dummyErrorWithoutMessage = { message: undefined };
      axiosGetStub.throws(dummyErrorWithoutMessage);
      const dummySrcLat = "dummySrcLat";
      const dummySrcLong = "dummySrcLong";
      const dummyDestLat = "dummyDestLat";
      const dummyDestLong = "dummyDestLong";
      const expectedApiUrl = `https://gg-backend-assignment.azurewebsites.net/api/Distance?code=${API_CODE}&latitude1=${dummySrcLat}&longitude1=${dummySrcLong}&latitude2=${dummyDestLat}&longitude2=${dummyDestLong}`;

      const distance = await getDistanceInKmBySrcAndDestnCoordinates(
        dummySrcLat,
        dummySrcLong,
        dummyDestLat,
        dummyDestLong,
      );

      expect(axiosGetStub.calledWith(expectedApiUrl)).to.be.true;
      expect(
        consoleErrorStub.calledWith("[distance_api]", dummyErrorWithoutMessage),
      ).to.be.true;
      expect(distance).to.be.null;
    });
  });
});
