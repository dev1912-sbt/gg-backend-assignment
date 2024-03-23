import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("services/events.js", () => {
  describe("fillEventWithWeatherAndDistance()", () => {
    let weatherApiGetWeatherByLocationAndDateStub;
    let distanceApiGetDistanceInKmBySrcAndDestnCoordinatesStub;

    let promiseAllStub;
    let consoleErrorStub;

    let fillEventWithWeatherAndDistance;

    beforeEach(async () => {
      weatherApiGetWeatherByLocationAndDateStub = sinon.stub();
      distanceApiGetDistanceInKmBySrcAndDestnCoordinatesStub = sinon.stub();

      promiseAllStub = sinon.stub(Promise, "all");
      consoleErrorStub = sinon.stub(console, "error");

      const esmockImports = await esmock("../../src/services/events.js", {
        "../../src/utils/weather_api.js": {
          getWeatherByLocationAndDate:
            weatherApiGetWeatherByLocationAndDateStub,
        },
        "../../src/utils/distance_api.js": {
          getDistanceInKmBySrcAndDestnCoordinates:
            distanceApiGetDistanceInKmBySrcAndDestnCoordinatesStub,
        },
      });
      fillEventWithWeatherAndDistance =
        esmockImports.fillEventWithWeatherAndDistance;
    });

    afterEach(() => {
      sinon.restore();
    });

    it("fills an event with weather and distance details with parallel api calls", async () => {
      const dummyEvent = {
        city_name: "dummyCityName",
        date: "dummyDate",
        coordinates: ["dummyLong", "dummyLat"],
      };
      const dummyDistanceSrcLat = "dummyDistanceSrcLat";
      const dummyDistanceSrcLong = "dummyDistanceSrcLong";
      const dummyWeather = "dummyWeather";
      const dummyWeatherPromise = Promise.resolve(dummyWeather);
      weatherApiGetWeatherByLocationAndDateStub.returns(dummyWeatherPromise);
      const dummyDistance = "dummyDistance";
      const dummyDistancePromise = Promise.resolve(dummyDistance);
      distanceApiGetDistanceInKmBySrcAndDestnCoordinatesStub.returns(
        dummyDistancePromise,
      );
      promiseAllStub.resolves(["dummyWeather", "dummyDistance"]);
      const expectedFilledEvent = {
        city_name: "dummyCityName",
        date: "dummyDate",
        coordinates: ["dummyLong", "dummyLat"],
        weather: "dummyWeather",
        distance_km: "dummyDistance",
      };

      const filledEvent = await fillEventWithWeatherAndDistance(
        dummyEvent,
        dummyDistanceSrcLat,
        dummyDistanceSrcLong,
      );

      expect(
        weatherApiGetWeatherByLocationAndDateStub.calledWith(
          "dummyCityName",
          "dummyDate",
        ),
      ).to.be.true;
      expect(
        distanceApiGetDistanceInKmBySrcAndDestnCoordinatesStub.calledWith(
          "dummyDistanceSrcLat",
          "dummyDistanceSrcLong",
          "dummyLat",
          "dummyLong",
        ),
      ).to.be.true;
      expect(
        promiseAllStub.calledWith([dummyWeatherPromise, dummyDistancePromise]),
      ).to.be.true;
      sinon.assert.match(filledEvent, sinon.match(expectedFilledEvent));
    });

    it("logs error message if weather api fails", async () => {
      const dummyEvent = {
        city_name: "dummyCityName",
        date: "dummyDate",
        coordinates: ["dummyLong", "dummyLat"],
      };
      const dummyDistanceSrcLat = "dummyDistanceSrcLat";
      const dummyDistanceSrcLong = "dummyDistanceSrcLong";
      const dummyError = new Error("dummyError");
      weatherApiGetWeatherByLocationAndDateStub.throws(dummyError);

      const filledEvent = await fillEventWithWeatherAndDistance(
        dummyEvent,
        dummyDistanceSrcLat,
        dummyDistanceSrcLong,
      );

      expect(
        weatherApiGetWeatherByLocationAndDateStub.calledWith(
          "dummyCityName",
          "dummyDate",
        ),
      ).to.be.true;
      expect(
        distanceApiGetDistanceInKmBySrcAndDestnCoordinatesStub.calledWith(
          "dummyDistanceSrcLat",
          "dummyDistanceSrcLong",
          "dummyLat",
          "dummyLong",
        ),
      ).to.be.false;
      expect(consoleErrorStub.calledWith("[services/events]", dummyError)).to.be
        .true;
      expect(filledEvent).to.be.null;
    });

    it("logs error message if distance api fails", async () => {
      const dummyEvent = {
        city_name: "dummyCityName",
        date: "dummyDate",
        coordinates: ["dummyLong", "dummyLat"],
      };
      const dummyDistanceSrcLat = "dummyDistanceSrcLat";
      const dummyDistanceSrcLong = "dummyDistanceSrcLong";
      const dummyWeather = "dummyWeather";
      weatherApiGetWeatherByLocationAndDateStub.resolves(dummyWeather);
      const dummyError = new Error("dummyError");
      distanceApiGetDistanceInKmBySrcAndDestnCoordinatesStub.throws(dummyError);

      const filledEvent = await fillEventWithWeatherAndDistance(
        dummyEvent,
        dummyDistanceSrcLat,
        dummyDistanceSrcLong,
      );

      expect(
        weatherApiGetWeatherByLocationAndDateStub.calledWith(
          "dummyCityName",
          "dummyDate",
        ),
      ).to.be.true;
      expect(
        distanceApiGetDistanceInKmBySrcAndDestnCoordinatesStub.calledWith(
          "dummyDistanceSrcLat",
          "dummyDistanceSrcLong",
          "dummyLat",
          "dummyLong",
        ),
      ).to.be.true;
      expect(consoleErrorStub.calledWith("[services/events]", dummyError)).to.be
        .true;
      expect(filledEvent).to.be.null;
    });
  });
});
