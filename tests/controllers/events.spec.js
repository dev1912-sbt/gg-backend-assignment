import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("controllers/events.js", () => {
  let dummyBody;
  let dummyQuery;
  let dummyRequest;

  let responseStatusStub;
  let responseJsonStub;
  let responseSendStub;
  let dummyResponse;

  let consoleErrorStub;

  let dummyEvent;
  let eventCreateStub;
  let mongooseQuerySortStub;
  let mongooseQuerySkipStub;
  let mongooseQueryLimitStub;
  let dummyMongooseQuery;
  let eventFindStub;
  let eventCountDocumentsStub;
  let eventsCreateCtrl;
  let eventsGetAllCtrl;

  beforeEach(async () => {
    dummyBody = {};
    dummyQuery = {};
    dummyRequest = {};

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
    mongooseQuerySortStub = sinon.stub();
    mongooseQuerySkipStub = sinon.stub();
    mongooseQueryLimitStub = sinon.stub();
    dummyMongooseQuery = {
      sort: mongooseQuerySortStub,
      skip: mongooseQuerySkipStub,
      limit: mongooseQueryLimitStub,
    };
    mongooseQuerySortStub.returns(dummyMongooseQuery);
    mongooseQuerySkipStub.returns(dummyMongooseQuery);
    eventFindStub = sinon.stub();
    eventCountDocumentsStub = sinon.stub();

    const esmockImports = await esmock("../../src/controllers/events.js", {
      "../../src/schemas/event.js": {
        create: eventCreateStub,
        find: eventFindStub,
        countDocuments: eventCountDocumentsStub,
      },
    });
    eventsCreateCtrl = esmockImports.eventsCreateCtrl;
    eventsGetAllCtrl = esmockImports.eventsGetAllCtrl;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("eventsCreateCtrl()", () => {
    it("creates and responds with the created event", async () => {
      dummyBody = {
        event_name: "event_name",
        city_name: "city_name",
        date: "date",
        latitude: "latitude",
        longitude: "longitude",
      };
      dummyRequest = { body: dummyBody };
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
      dummyBody = {
        event_name: "event_name",
        city_name: "city_name",
        date: "date",
        latitude: "latitude",
        longitude: "longitude",
      };
      dummyRequest = { body: dummyBody };
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
      dummyBody = {
        event_name: "event_name",
        city_name: "city_name",
        date: "date",
        latitude: "latitude",
        longitude: "longitude",
      };
      dummyRequest = { body: dummyBody };
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

  describe("eventsGetAllCtrl()", () => {
    it("gets all page 1 events if page is not specified", async () => {
      dummyQuery = {};
      dummyRequest = { query: dummyQuery };
      const dummyEvents = ["event"];
      mongooseQueryLimitStub.resolves(dummyEvents);
      eventCountDocumentsStub.resolves(dummyEvents.length);
      eventFindStub.returns(dummyMongooseQuery);

      await eventsGetAllCtrl(dummyRequest, dummyResponse);

      expect(eventCountDocumentsStub.calledWith({})).to.be.true;
      expect(eventFindStub.calledWith({})).to.be.true;
      expect(mongooseQuerySortStub.calledWith({ createdAt: -1 })).to.be.true;
      expect(mongooseQuerySkipStub.calledWith(0)).to.be.true;
      expect(mongooseQueryLimitStub.calledWith(10)).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(
        responseJsonStub.calledWith({
          events: dummyEvents,
          page: 1,
          pageSize: 10,
          totalEvents: dummyEvents.length,
          totalPages: 1,
        }),
      ).to.be.true;
    });

    it("gets all page 1 events if page specified is 1", async () => {
      dummyQuery = { page: 1 };
      dummyRequest = { query: dummyQuery };
      const dummyEvents = ["event"];
      mongooseQueryLimitStub.resolves(dummyEvents);
      eventCountDocumentsStub.resolves(dummyEvents.length);
      eventFindStub.returns(dummyMongooseQuery);

      await eventsGetAllCtrl(dummyRequest, dummyResponse);

      expect(eventCountDocumentsStub.calledWith({})).to.be.true;
      expect(eventFindStub.calledWith({})).to.be.true;
      expect(mongooseQuerySortStub.calledWith({ createdAt: -1 })).to.be.true;
      expect(mongooseQuerySkipStub.calledWith(0)).to.be.true;
      expect(mongooseQueryLimitStub.calledWith(10)).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(
        responseJsonStub.calledWith({
          events: dummyEvents,
          page: 1,
          pageSize: 10,
          totalEvents: dummyEvents.length,
          totalPages: 1,
        }),
      ).to.be.true;
    });

    it("gets all page 2 events if page specified is 2", async () => {
      dummyQuery = { page: 2 };
      dummyRequest = { query: dummyQuery };
      const dummyTwoPageEvents = [
        "event1",
        "event2",
        "event3",
        "event4",
        "event5",
        ,
        "event6",
        ,
        "event7",
        ,
        "event8",
        ,
        "event9",
        ,
        "event10",
        ,
        "event11",
      ];
      mongooseQueryLimitStub.resolves(dummyTwoPageEvents);
      eventCountDocumentsStub.resolves(dummyTwoPageEvents.length);
      eventFindStub.returns(dummyMongooseQuery);

      await eventsGetAllCtrl(dummyRequest, dummyResponse);

      expect(eventCountDocumentsStub.calledWith({})).to.be.true;
      expect(eventFindStub.calledWith({})).to.be.true;
      expect(mongooseQuerySortStub.calledWith({ createdAt: -1 })).to.be.true;
      expect(mongooseQuerySkipStub.calledWith(10)).to.be.true;
      expect(mongooseQueryLimitStub.calledWith(10)).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(
        responseJsonStub.calledWith({
          events: dummyTwoPageEvents,
          page: 2,
          pageSize: 10,
          totalEvents: dummyTwoPageEvents.length,
          totalPages: 2,
        }),
      ).to.be.true;
    });

    it("respond with error message if page exceeds the available pages", async () => {
      dummyQuery = { page: 2 };
      dummyRequest = { query: dummyQuery };
      const dummyEvents = ["event"];
      eventCountDocumentsStub.resolves(dummyEvents.length);

      await eventsGetAllCtrl(dummyRequest, dummyResponse);

      expect(eventCountDocumentsStub.calledWith({})).to.be.true;
      expect(responseStatusStub.calledWith(400)).to.be.true;
      expect(
        responseSendStub.calledWith(
          "Page specified exceeds the available pages",
        ),
      ).to.be.true;
      expect(eventFindStub.calledWith({})).to.be.false;
      expect(mongooseQuerySortStub.calledWith({ createdAt: -1 })).to.be.false;
      expect(mongooseQuerySkipStub.calledWith(10)).to.be.false;
      expect(mongooseQueryLimitStub.calledWith(10)).to.be.false;
      expect(responseStatusStub.calledWith(200)).to.be.false;
      expect(
        responseJsonStub.calledWith({
          events: dummyEvents,
          page: 2,
          pageSize: 10,
          totalEvents: dummyEvents.length,
          totalPages: 2,
        }),
      ).to.be.false;
    });

    it("respond with error message if finding events fails with an error message", async () => {
      dummyQuery = {};
      dummyRequest = { query: dummyQuery };
      const dummyEvents = ["event"];
      eventCountDocumentsStub.resolves(dummyEvents.length);
      eventFindStub.returns(dummyMongooseQuery);
      const dummyErrorWithMessage = new Error("dummyErrorWithMessage");
      mongooseQueryLimitStub.throws(dummyErrorWithMessage);

      await eventsGetAllCtrl(dummyRequest, dummyResponse);

      expect(eventCountDocumentsStub.calledWith({})).to.be.true;
      expect(eventFindStub.calledWith({})).to.be.true;
      expect(mongooseQuerySortStub.calledWith({ createdAt: -1 })).to.be.true;
      expect(mongooseQuerySkipStub.calledWith(0)).to.be.true;
      expect(mongooseQueryLimitStub.calledWith(10)).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.false;
      expect(
        responseJsonStub.calledWith({
          events: dummyEvents,
          page: 1,
          pageSize: 10,
          totalEvents: dummyEvents.length,
          totalPages: 1,
        }),
      ).to.be.false;
      expect(
        consoleErrorStub.calledWith(
          "[controllers/events]",
          dummyErrorWithMessage,
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(500)).to.be.true;
      expect(responseSendStub.calledWith("dummyErrorWithMessage")).to.be.true;
    });

    it("respond with error message if finding events fails without an error message", async () => {
      dummyQuery = {};
      dummyRequest = { query: dummyQuery };
      const dummyEvents = ["event"];
      eventCountDocumentsStub.resolves(dummyEvents.length);
      eventFindStub.returns(dummyMongooseQuery);
      const dummyErrorWithoutMessage = { message: undefined };
      mongooseQueryLimitStub.throws(dummyErrorWithoutMessage);

      await eventsGetAllCtrl(dummyRequest, dummyResponse);

      expect(eventCountDocumentsStub.calledWith({})).to.be.true;
      expect(eventFindStub.calledWith({})).to.be.true;
      expect(mongooseQuerySortStub.calledWith({ createdAt: -1 })).to.be.true;
      expect(mongooseQuerySkipStub.calledWith(0)).to.be.true;
      expect(mongooseQueryLimitStub.calledWith(10)).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.false;
      expect(
        responseJsonStub.calledWith({
          events: dummyEvents,
          page: 1,
          pageSize: 10,
          totalEvents: dummyEvents.length,
          totalPages: 1,
        }),
      ).to.be.false;
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
