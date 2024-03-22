import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("controllers/events.js", () => {
  let dummyBody;
  let dummyRequest;

  let responseStatusStub;
  let responseJsonStub;
  let responseSendStub;
  let dummyResponse;

  let consoleErrorStub;

  let dummyEvent;
  let eventCreateStub;
  let eventsCreateCtrl;

  beforeEach(async () => {
    dummyBody = {
      event_name: "event_name",
      city_name: "city_name",
      date: "date",
      latitude: "latitude",
      longitude: "longitude",
    };
    dummyRequest = {
      body: dummyBody,
    };

    responseStatusStub = sinon.stub();
    responseJsonStub = sinon.stub();
    responseSendStub = sinon.stub();
    dummyResponse = {
      status: responseStatusStub,
      json: responseJsonStub,
      send: responseSendStub,
    };
    responseStatusStub.returns(dummyResponse);

    consoleErrorStub = sinon.stub(console, "error");

    dummyEvent = {};
    eventCreateStub = sinon.stub();
    const esmockImports = await esmock("../../src/controllers/events.js", {
      "../../src/schemas/event.js": {
        create: eventCreateStub,
      },
    });
    eventsCreateCtrl = esmockImports.eventsCreateCtrl;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("eventsCreateCtrl()", () => {
    it("creates and responds with the created event", async () => {
      eventCreateStub.resolves(dummyEvent);

      await eventsCreateCtrl(dummyRequest, dummyResponse);

      expect(
        eventCreateStub.calledWith({
          event_name: "event_name",
          city_name: "city_name",
          date: "date",
          coordinates: ["latitude", "longitude"],
        }),
      ).to.be.true;
      expect(responseStatusStub.calledWith(201)).to.be.true;
      expect(responseJsonStub.calledWith({ event: dummyEvent })).to.be.true;
    });

    it("responds with error message if the event creation fails with a message", async () => {
      const dummyErrorWithMessage = new Error("dummyErrorWithMessage");
      eventCreateStub.throws(dummyErrorWithMessage);

      await eventsCreateCtrl(dummyRequest, dummyResponse);

      expect(
        eventCreateStub.calledWith({
          event_name: "event_name",
          city_name: "city_name",
          date: "date",
          coordinates: ["latitude", "longitude"],
        }),
      ).to.be.true;
      expect(responseStatusStub.calledWith(201)).to.be.false;
      expect(responseJsonStub.calledWith({ event: dummyEvent })).to.be.false;
      expect(
        consoleErrorStub.calledWith(
          "[controllers/events]",
          dummyErrorWithMessage,
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(500)).to.be.true;
      expect(responseSendStub.calledWith("dummyErrorWithMessage")).to.be.true;
    });

    it("responds with generic error message if the event creation fails without a message", async () => {
      const dummyErrorWithoutMessage = { message: undefined };
      eventCreateStub.throws(dummyErrorWithoutMessage);

      await eventsCreateCtrl(dummyRequest, dummyResponse);

      expect(
        eventCreateStub.calledWith({
          event_name: "event_name",
          city_name: "city_name",
          date: "date",
          coordinates: ["latitude", "longitude"],
        }),
      ).to.be.true;
      expect(responseStatusStub.calledWith(201)).to.be.false;
      expect(responseJsonStub.calledWith({ event: dummyEvent })).to.be.false;
      expect(
        consoleErrorStub.calledWith(
          "[controllers/events]",
          dummyErrorWithoutMessage,
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(500)).to.be.true;
      expect(responseSendStub.calledWith("Unknown error occurred")).to.be.true;
    });
  });
});
