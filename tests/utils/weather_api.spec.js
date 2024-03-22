import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("utils/weather_api.js", () => {
  describe("getWeatherByLocationAndDate()", () => {
    let dummyAxiosResponse;
    let axiosGetStub;

    let consoleErrorStub;

    let API_CODE;
    let getWeatherByLocationAndDate;

    beforeEach(async () => {
      dummyAxiosResponse = {
        data: {
          weather: "dummyWeather",
        },
      };

      consoleErrorStub = sinon.stub(console, "error");

      axiosGetStub = sinon.stub();
      const esmockImports = await esmock("../../src/utils/weather_api.js", {
        axios: {
          get: axiosGetStub,
        },
      });
      API_CODE = esmockImports.API_CODE;
      getWeatherByLocationAndDate = esmockImports.getWeatherByLocationAndDate;
    });

    afterEach(() => {
      sinon.restore();
    });

    it("gets the weather", async () => {
      axiosGetStub.resolves(dummyAxiosResponse);
      const dummyCityName = "Dummy City Name";
      const dummyDate = new Date("2024-03-14T06:00:00Z");
      const expectedCityName = "Dummy%20City%20Name";
      const expectedDate = "2024-03-14";
      const expectedApiUrl = `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=${API_CODE}&city=${expectedCityName}&date=${expectedDate}`;
      const expectedWeather = "dummyWeather";

      const weather = await getWeatherByLocationAndDate(
        dummyCityName,
        dummyDate,
      );

      expect(axiosGetStub.calledWith(expectedApiUrl)).to.be.true;
      expect(weather).to.be.equal(expectedWeather);
    });

    it("displays error message and returns null if api request failed with an error message", async () => {
      const dummyErrorWithMessage = new Error("dummyErrorWithMessage");
      axiosGetStub.throws(dummyErrorWithMessage);
      const dummyCityName = "Dummy City Name";
      const dummyDate = new Date("2024-03-14T06:00:00Z");
      const expectedCityName = "Dummy%20City%20Name";
      const expectedDate = "2024-03-14";
      const expectedApiUrl = `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=${API_CODE}&city=${expectedCityName}&date=${expectedDate}`;

      const weather = await getWeatherByLocationAndDate(
        dummyCityName,
        dummyDate,
      );

      expect(axiosGetStub.calledWith(expectedApiUrl)).to.be.true;
      expect(
        consoleErrorStub.calledWith("[weather_api]", "dummyErrorWithMessage"),
      ).to.be.true;
      expect(weather).to.be.null;
    });

    it("displays complete error message and returns null if api request failed without an error message", async () => {
      const dummyErrorWithoutMessage = { message: undefined };
      axiosGetStub.throws(dummyErrorWithoutMessage);
      const dummyCityName = "Dummy City Name";
      const dummyDate = new Date("2024-03-14T06:00:00Z");
      const expectedCityName = "Dummy%20City%20Name";
      const expectedDate = "2024-03-14";
      const expectedApiUrl = `https://gg-backend-assignment.azurewebsites.net/api/Weather?code=${API_CODE}&city=${expectedCityName}&date=${expectedDate}`;

      const weather = await getWeatherByLocationAndDate(
        dummyCityName,
        dummyDate,
      );

      expect(axiosGetStub.calledWith(expectedApiUrl)).to.be.true;
      expect(
        consoleErrorStub.calledWith("[weather_api]", dummyErrorWithoutMessage),
      ).to.be.true;
      expect(weather).to.be.null;
    });
  });
});
