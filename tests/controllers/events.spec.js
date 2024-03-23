import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("controllers/events.js", () => {
  let dummyBody;
  let dummyParams;
  let dummyRequest;

  let responseStatusStub;
  let responseJsonStub;
  let responseSendStub;
  let dummyResponse;

  let consoleErrorStub;

  let dummyEvent;
  let eventAggregateStub;
  let eventCreateStub;
  let mongooseQuerySortStub;
  let mongooseQuerySkipStub;
  let mongooseQueryLimitStub;
  let dummyMongooseQuery;
  let eventFindStub;
  let eventFindByIdStub;
  let eventFindByIdAndUpdateStub;
  let eventFindByIdAndDeleteStub;
  let eventCountDocumentsStub;

  let temporalConvertIndianDateToZuluDate;
  let temporalAddDaysToDateStub;

  let eventsFillEventWithWeatherAndDistanceStub;

  let eventsCreateCtrl;
  let eventsGetAllCtrl;
  let eventsFindCtrl;
  let eventsGetByIdCtrl;
  let eventsUpsertByIdCtrl;
  let eventsDeleteByIdCtrl;

  beforeEach(async () => {
    dummyBody = {};
    dummyParams = {};
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
    eventAggregateStub = sinon.stub();
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
    eventFindByIdStub = sinon.stub();
    eventFindByIdAndUpdateStub = sinon.stub();
    eventFindByIdAndDeleteStub = sinon.stub();
    eventCountDocumentsStub = sinon.stub();

    temporalConvertIndianDateToZuluDate = sinon.stub();
    temporalAddDaysToDateStub = sinon.stub();

    eventsFillEventWithWeatherAndDistanceStub = sinon.stub();

    const esmockImports = await esmock("../../src/controllers/events.js", {
      "../../src/schemas/event.js": {
        aggregate: eventAggregateStub,
        create: eventCreateStub,
        find: eventFindStub,
        findById: eventFindByIdStub,
        findByIdAndUpdate: eventFindByIdAndUpdateStub,
        findByIdAndDelete: eventFindByIdAndDeleteStub,
        countDocuments: eventCountDocumentsStub,
      },
      "../../src/utils/temporal.js": {
        convertIndianDateToZuluDate: temporalConvertIndianDateToZuluDate,
        addDaysToDate: temporalAddDaysToDateStub,
      },
      "../../src/services/events.js": {
        fillEventWithWeatherAndDistance:
          eventsFillEventWithWeatherAndDistanceStub,
      },
    });
    eventsCreateCtrl = esmockImports.eventsCreateCtrl;
    eventsGetAllCtrl = esmockImports.eventsGetAllCtrl;
    eventsGetByIdCtrl = esmockImports.eventsGetByIdCtrl;
    eventsFindCtrl = esmockImports.eventsFindCtrl;
    eventsUpsertByIdCtrl = esmockImports.eventsUpsertByIdCtrl;
    eventsDeleteByIdCtrl = esmockImports.eventsDeleteByIdCtrl;
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
      dummyParams = {};
      dummyRequest = { query: dummyParams };
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
      dummyParams = { page: 1 };
      dummyRequest = { query: dummyParams };
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
      dummyParams = { page: 2 };
      dummyRequest = { query: dummyParams };
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

    it("responds with error message if page exceeds the available pages", async () => {
      dummyParams = { page: 2 };
      dummyRequest = { query: dummyParams };
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

    it("responds with error message if finding events fails with an error message", async () => {
      dummyParams = {};
      dummyRequest = { query: dummyParams };
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

    it("responds with error message if finding events fails without an error message", async () => {
      dummyParams = {};
      dummyRequest = { query: dummyParams };
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

  describe("eventsFindCtrl()", () => {
    it("finds all page 1 events using query parameters without page", async () => {
      const dummySearchDate = "2024-03-14";
      const sameDummySearchDate = new Date(dummySearchDate);
      dummyParams = {
        srcLat: "dummySrcLat",
        srcLong: "dummySrcLong",
        searchDate: dummySearchDate,
      };
      dummyRequest = { query: dummyParams };
      const dummyZuluSearchDate = "dummyZuluSearchDate";
      temporalConvertIndianDateToZuluDate.returns(dummyZuluSearchDate);
      const dummyZuluSearchDateAfter14Days = "dummyZuluSearchDateAfter14Days";
      temporalAddDaysToDateStub.returns(dummyZuluSearchDateAfter14Days);
      const dummyEvents = [
        {
          event_name: "event",
          coordinates: "dummyCoordinates",
        },
      ];
      const dummyAggregationResult = [
        {
          events: dummyEvents,
          count: 1,
        },
      ];
      eventAggregateStub.resolves(dummyAggregationResult);
      const filledEvents = [
        {
          event_name: "filledEvent",
          coordinates: "dummyCoordinates",
        },
      ];
      eventsFillEventWithWeatherAndDistanceStub.resolves(filledEvents[0]);
      const expectedFilledEvents = [
        {
          event_name: "filledEvent",
        },
      ];

      await eventsFindCtrl(dummyRequest, dummyResponse);

      sinon.assert.calledWith(
        temporalConvertIndianDateToZuluDate,
        sinon.match(sameDummySearchDate),
      );
      expect(temporalAddDaysToDateStub.calledWith(dummyZuluSearchDate, 14)).to
        .be.true;
      expect(
        eventAggregateStub.calledWith([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: ["dummySrcLong", "dummySrcLat"],
              },
              distanceField: "dist_calculated",
              includeLocs: "coordinates",
            },
          },
          {
            $match: {
              date: {
                $gte: "dummyZuluSearchDate",
                $lte: "dummyZuluSearchDateAfter14Days",
              },
            },
          },
          { $sort: { date: 1 } },
          { $unset: ["_id", "dist_calculated"] },
          {
            $group: {
              _id: "aggregation",
              events: { $push: "$$ROOT" },
              count: { $sum: 1 },
            },
          },
          {
            $set: {
              events: { $slice: ["$events", 0, 10] },
            },
          },
        ]),
      ).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(
        responseJsonStub.calledWith({
          events: expectedFilledEvents,
          page: 1,
          pageSize: 10,
          totalEvents: 1,
          totalPages: 1,
        }),
      ).to.be.true;
    });

    it("finds all page 1 events using query parameters with page set to 1", async () => {
      const dummySearchDate = "2024-03-14";
      const sameDummySearchDate = new Date(dummySearchDate);
      dummyParams = {
        srcLat: "dummySrcLat",
        srcLong: "dummySrcLong",
        searchDate: dummySearchDate,
        page: 1,
      };
      dummyRequest = { query: dummyParams };
      const dummyZuluSearchDate = "dummyZuluSearchDate";
      temporalConvertIndianDateToZuluDate.returns(dummyZuluSearchDate);
      const dummyZuluSearchDateAfter14Days = "dummyZuluSearchDateAfter14Days";
      temporalAddDaysToDateStub.returns(dummyZuluSearchDateAfter14Days);
      const dummyEvents = [
        {
          event_name: "event",
          coordinates: "dummyCoordinates",
        },
      ];
      const dummyAggregationResult = [
        {
          events: dummyEvents,
          count: 1,
        },
      ];
      eventAggregateStub.resolves(dummyAggregationResult);
      const filledEvents = [
        {
          event_name: "filledEvent",
          coordinates: "dummyCoordinates",
        },
      ];
      eventsFillEventWithWeatherAndDistanceStub.resolves(filledEvents[0]);
      const expectedFilledEvents = [
        {
          event_name: "filledEvent",
        },
      ];

      await eventsFindCtrl(dummyRequest, dummyResponse);

      sinon.assert.calledWith(
        temporalConvertIndianDateToZuluDate,
        sinon.match(sameDummySearchDate),
      );
      expect(temporalAddDaysToDateStub.calledWith(dummyZuluSearchDate, 14)).to
        .be.true;
      expect(
        eventAggregateStub.calledWith([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: ["dummySrcLong", "dummySrcLat"],
              },
              distanceField: "dist_calculated",
              includeLocs: "coordinates",
            },
          },
          {
            $match: {
              date: {
                $gte: "dummyZuluSearchDate",
                $lte: "dummyZuluSearchDateAfter14Days",
              },
            },
          },
          { $sort: { date: 1 } },
          { $unset: ["_id", "dist_calculated"] },
          {
            $group: {
              _id: "aggregation",
              events: { $push: "$$ROOT" },
              count: { $sum: 1 },
            },
          },
          {
            $set: {
              events: { $slice: ["$events", 0, 10] },
            },
          },
        ]),
      ).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(
        responseJsonStub.calledWith({
          events: expectedFilledEvents,
          page: 1,
          pageSize: 10,
          totalEvents: 1,
          totalPages: 1,
        }),
      ).to.be.true;
    });

    it("finds all page 2 events using query parameters with page set to 2", async () => {
      const dummySearchDate = "2024-03-14";
      const sameDummySearchDate = new Date(dummySearchDate);
      dummyParams = {
        srcLat: "dummySrcLat",
        srcLong: "dummySrcLong",
        searchDate: dummySearchDate,
        page: 2,
      };
      dummyRequest = { query: dummyParams };
      const dummyZuluSearchDate = "dummyZuluSearchDate";
      temporalConvertIndianDateToZuluDate.returns(dummyZuluSearchDate);
      const dummyZuluSearchDateAfter14Days = "dummyZuluSearchDateAfter14Days";
      temporalAddDaysToDateStub.returns(dummyZuluSearchDateAfter14Days);
      const dummyPage2Events = [
        {
          event_name: "event",
          coordinates: "dummyCoordinates",
        },
      ];
      const dummyPage2AggregationResult = [
        {
          events: dummyPage2Events,
          count: 11,
        },
      ];
      eventAggregateStub.resolves(dummyPage2AggregationResult);
      const page2FilledEvents = [
        {
          event_name: "filledEvent",
          coordinates: "dummyCoordinates",
        },
      ];
      eventsFillEventWithWeatherAndDistanceStub.resolves(page2FilledEvents[0]);
      const expectedPage2FilledEvents = [
        {
          event_name: "filledEvent",
        },
      ];

      await eventsFindCtrl(dummyRequest, dummyResponse);

      sinon.assert.calledWith(
        temporalConvertIndianDateToZuluDate,
        sinon.match(sameDummySearchDate),
      );
      expect(temporalAddDaysToDateStub.calledWith(dummyZuluSearchDate, 14)).to
        .be.true;
      expect(
        eventAggregateStub.calledWith([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: ["dummySrcLong", "dummySrcLat"],
              },
              distanceField: "dist_calculated",
              includeLocs: "coordinates",
            },
          },
          {
            $match: {
              date: {
                $gte: "dummyZuluSearchDate",
                $lte: "dummyZuluSearchDateAfter14Days",
              },
            },
          },
          { $sort: { date: 1 } },
          { $unset: ["_id", "dist_calculated"] },
          {
            $group: {
              _id: "aggregation",
              events: { $push: "$$ROOT" },
              count: { $sum: 1 },
            },
          },
          {
            $set: {
              events: { $slice: ["$events", 10, 10] },
            },
          },
        ]),
      ).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(
        responseJsonStub.calledWith({
          events: expectedPage2FilledEvents,
          page: 2,
          pageSize: 10,
          totalEvents: 11,
          totalPages: 2,
        }),
      ).to.be.true;
    });

    it("finds all page 1 mixed events using query parameters if filling an event fails", async () => {
      const dummySearchDate = "2024-03-14";
      const sameDummySearchDate = new Date(dummySearchDate);
      dummyParams = {
        srcLat: "dummySrcLat",
        srcLong: "dummySrcLong",
        searchDate: dummySearchDate,
      };
      dummyRequest = { query: dummyParams };
      const dummyZuluSearchDate = "dummyZuluSearchDate";
      temporalConvertIndianDateToZuluDate.returns(dummyZuluSearchDate);
      const dummyZuluSearchDateAfter14Days = "dummyZuluSearchDateAfter14Days";
      temporalAddDaysToDateStub.returns(dummyZuluSearchDateAfter14Days);
      const dummyEvents = [
        {
          event_name: "eventToBeFilled",
          coordinates: "dummyCoordinates",
        },
        {
          event_name: "eventNotToBeFilled",
          coordinates: "dummyCoordinates",
        },
      ];
      const dummyAggregationResult = [
        {
          events: dummyEvents,
          count: 2,
        },
      ];
      eventAggregateStub.resolves(dummyAggregationResult);
      const filledEvents = [
        {
          event_name: "filledEvent",
          coordinates: "dummyCoordinates",
        },
      ];
      eventsFillEventWithWeatherAndDistanceStub
        .onFirstCall()
        .resolves(filledEvents[0]);
      eventsFillEventWithWeatherAndDistanceStub.onSecondCall().resolves(null);
      const mixedFilledEvents = [
        {
          event_name: "filledEvent",
        },
        {
          event_name: "eventNotToBeFilled",
          coordinates: "dummyCoordinates",
        },
      ];

      await eventsFindCtrl(dummyRequest, dummyResponse);

      sinon.assert.calledWith(
        temporalConvertIndianDateToZuluDate,
        sinon.match(sameDummySearchDate),
      );
      expect(temporalAddDaysToDateStub.calledWith(dummyZuluSearchDate, 14)).to
        .be.true;
      expect(
        eventAggregateStub.calledWith([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: ["dummySrcLong", "dummySrcLat"],
              },
              distanceField: "dist_calculated",
              includeLocs: "coordinates",
            },
          },
          {
            $match: {
              date: {
                $gte: "dummyZuluSearchDate",
                $lte: "dummyZuluSearchDateAfter14Days",
              },
            },
          },
          { $sort: { date: 1 } },
          { $unset: ["_id", "dist_calculated"] },
          {
            $group: {
              _id: "aggregation",
              events: { $push: "$$ROOT" },
              count: { $sum: 1 },
            },
          },
          {
            $set: {
              events: { $slice: ["$events", 0, 10] },
            },
          },
        ]),
      ).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(
        responseJsonStub.calledWith({
          events: mixedFilledEvents,
          page: 1,
          pageSize: 10,
          totalEvents: 2,
          totalPages: 1,
        }),
      ).to.be.true;
    });

    it("responds with 201 no content if aggregation returns empty result", async () => {
      const dummySearchDate = "2024-03-14";
      const sameDummySearchDate = new Date(dummySearchDate);
      dummyParams = {
        srcLat: "dummySrcLat",
        srcLong: "dummySrcLong",
        searchDate: dummySearchDate,
      };
      dummyRequest = { query: dummyParams };
      const dummyZuluSearchDate = "dummyZuluSearchDate";
      temporalConvertIndianDateToZuluDate.returns(dummyZuluSearchDate);
      const dummyZuluSearchDateAfter14Days = "dummyZuluSearchDateAfter14Days";
      temporalAddDaysToDateStub.returns(dummyZuluSearchDateAfter14Days);
      const dummyEmptyAggregationResult = [];
      eventAggregateStub.resolves(dummyEmptyAggregationResult);

      await eventsFindCtrl(dummyRequest, dummyResponse);

      sinon.assert.calledWith(
        temporalConvertIndianDateToZuluDate,
        sinon.match(sameDummySearchDate),
      );
      expect(temporalAddDaysToDateStub.calledWith(dummyZuluSearchDate, 14)).to
        .be.true;
      expect(
        eventAggregateStub.calledWith([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: ["dummySrcLong", "dummySrcLat"],
              },
              distanceField: "dist_calculated",
              includeLocs: "coordinates",
            },
          },
          {
            $match: {
              date: {
                $gte: "dummyZuluSearchDate",
                $lte: "dummyZuluSearchDateAfter14Days",
              },
            },
          },
          { $sort: { date: 1 } },
          { $unset: ["_id", "dist_calculated"] },
          {
            $group: {
              _id: "aggregation",
              events: { $push: "$$ROOT" },
              count: { $sum: 1 },
            },
          },
          {
            $set: {
              events: { $slice: ["$events", 0, 10] },
            },
          },
        ]),
      ).to.be.true;
      expect(responseStatusStub.calledWith(204)).to.be.true;
      expect(responseSendStub.calledWith("No events to display")).to.be.true;
    });

    it("responds with error message if page exceeds the available pages", async () => {
      const dummySearchDate = "2024-03-14";
      const sameDummySearchDate = new Date(dummySearchDate);
      dummyParams = {
        srcLat: "dummySrcLat",
        srcLong: "dummySrcLong",
        searchDate: dummySearchDate,
        page: 2,
      };
      dummyRequest = { query: dummyParams };
      const dummyZuluSearchDate = "dummyZuluSearchDate";
      temporalConvertIndianDateToZuluDate.returns(dummyZuluSearchDate);
      const dummyZuluSearchDateAfter14Days = "dummyZuluSearchDateAfter14Days";
      temporalAddDaysToDateStub.returns(dummyZuluSearchDateAfter14Days);
      const dummyEvents = [
        {
          event_name: "event",
          coordinates: "dummyCoordinates",
        },
      ];
      const dummyAggregationResult = [
        {
          events: dummyEvents,
          count: 1,
        },
      ];
      eventAggregateStub.resolves(dummyAggregationResult);

      await eventsFindCtrl(dummyRequest, dummyResponse);

      sinon.assert.calledWith(
        temporalConvertIndianDateToZuluDate,
        sinon.match(sameDummySearchDate),
      );
      expect(temporalAddDaysToDateStub.calledWith(dummyZuluSearchDate, 14)).to
        .be.true;
      expect(
        eventAggregateStub.calledWith([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: ["dummySrcLong", "dummySrcLat"],
              },
              distanceField: "dist_calculated",
              includeLocs: "coordinates",
            },
          },
          {
            $match: {
              date: {
                $gte: "dummyZuluSearchDate",
                $lte: "dummyZuluSearchDateAfter14Days",
              },
            },
          },
          { $sort: { date: 1 } },
          { $unset: ["_id", "dist_calculated"] },
          {
            $group: {
              _id: "aggregation",
              events: { $push: "$$ROOT" },
              count: { $sum: 1 },
            },
          },
          {
            $set: {
              events: { $slice: ["$events", 10, 10] },
            },
          },
        ]),
      ).to.be.true;
      expect(responseStatusStub.calledWith(400)).to.be.true;
      expect(
        responseSendStub.calledWith(
          "Page specified exceeds the available pages",
        ),
      ).to.be.true;
    });

    it("responds with error message if events aggregation fails with an error message", async () => {
      const dummySearchDate = "2024-03-14";
      const sameDummySearchDate = new Date(dummySearchDate);
      dummyParams = {
        srcLat: "dummySrcLat",
        srcLong: "dummySrcLong",
        searchDate: dummySearchDate,
      };
      dummyRequest = { query: dummyParams };
      const dummyZuluSearchDate = "dummyZuluSearchDate";
      temporalConvertIndianDateToZuluDate.returns(dummyZuluSearchDate);
      const dummyZuluSearchDateAfter14Days = "dummyZuluSearchDateAfter14Days";
      temporalAddDaysToDateStub.returns(dummyZuluSearchDateAfter14Days);
      const dummyAggregationErrorWithMessage = new Error(
        "dummyAggregationErrorWithMessage",
      );
      eventAggregateStub.throws(dummyAggregationErrorWithMessage);

      await eventsFindCtrl(dummyRequest, dummyResponse);

      sinon.assert.calledWith(
        temporalConvertIndianDateToZuluDate,
        sinon.match(sameDummySearchDate),
      );
      expect(temporalAddDaysToDateStub.calledWith(dummyZuluSearchDate, 14)).to
        .be.true;
      expect(
        eventAggregateStub.calledWith([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: ["dummySrcLong", "dummySrcLat"],
              },
              distanceField: "dist_calculated",
              includeLocs: "coordinates",
            },
          },
          {
            $match: {
              date: {
                $gte: "dummyZuluSearchDate",
                $lte: "dummyZuluSearchDateAfter14Days",
              },
            },
          },
          { $sort: { date: 1 } },
          { $unset: ["_id", "dist_calculated"] },
          {
            $group: {
              _id: "aggregation",
              events: { $push: "$$ROOT" },
              count: { $sum: 1 },
            },
          },
          {
            $set: {
              events: { $slice: ["$events", 0, 10] },
            },
          },
        ]),
      ).to.be.true;
      expect(
        consoleErrorStub.calledWith(
          "[controllers/events]",
          dummyAggregationErrorWithMessage,
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(500)).to.be.true;
      expect(responseSendStub.calledWith("dummyAggregationErrorWithMessage")).to
        .be.true;
    });

    it("responds with error message if events aggregation fails without an error message", async () => {
      const dummySearchDate = "2024-03-14";
      const sameDummySearchDate = new Date(dummySearchDate);
      dummyParams = {
        srcLat: "dummySrcLat",
        srcLong: "dummySrcLong",
        searchDate: dummySearchDate,
      };
      dummyRequest = { query: dummyParams };
      const dummyZuluSearchDate = "dummyZuluSearchDate";
      temporalConvertIndianDateToZuluDate.returns(dummyZuluSearchDate);
      const dummyZuluSearchDateAfter14Days = "dummyZuluSearchDateAfter14Days";
      temporalAddDaysToDateStub.returns(dummyZuluSearchDateAfter14Days);
      const dummyAggregationErrorWithoutMessage = { message: undefined };
      eventAggregateStub.throws(dummyAggregationErrorWithoutMessage);

      await eventsFindCtrl(dummyRequest, dummyResponse);

      sinon.assert.calledWith(
        temporalConvertIndianDateToZuluDate,
        sinon.match(sameDummySearchDate),
      );
      expect(temporalAddDaysToDateStub.calledWith(dummyZuluSearchDate, 14)).to
        .be.true;
      expect(
        eventAggregateStub.calledWith([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: ["dummySrcLong", "dummySrcLat"],
              },
              distanceField: "dist_calculated",
              includeLocs: "coordinates",
            },
          },
          {
            $match: {
              date: {
                $gte: "dummyZuluSearchDate",
                $lte: "dummyZuluSearchDateAfter14Days",
              },
            },
          },
          { $sort: { date: 1 } },
          { $unset: ["_id", "dist_calculated"] },
          {
            $group: {
              _id: "aggregation",
              events: { $push: "$$ROOT" },
              count: { $sum: 1 },
            },
          },
          {
            $set: {
              events: { $slice: ["$events", 0, 10] },
            },
          },
        ]),
      ).to.be.true;
      expect(
        consoleErrorStub.calledWith(
          "[controllers/events]",
          dummyAggregationErrorWithoutMessage,
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(500)).to.be.true;
      expect(responseSendStub.calledWith("Unknown error occurred")).to.be.true;
    });
  });

  describe("eventsGetByIdCtrl()", () => {
    it("finds an event by it's id", async () => {
      dummyParams = { id: "dummyId" };
      dummyRequest = { params: dummyParams };
      const dummyEvent = "event";
      eventFindByIdStub.resolves(dummyEvent);

      await eventsGetByIdCtrl(dummyRequest, dummyResponse);

      expect(eventFindByIdStub.calledWith("dummyId")).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(responseJsonStub.calledWith({ event: dummyEvent })).to.be.true;
    });

    it("responds with error message if the event was not found", async () => {
      dummyParams = { id: "dummyId" };
      dummyRequest = { params: dummyParams };
      eventFindByIdStub.resolves(null);

      await eventsGetByIdCtrl(dummyRequest, dummyResponse);

      expect(eventFindByIdStub.calledWith("dummyId")).to.be.true;
      expect(responseStatusStub.calledWith(404)).to.be.true;
      expect(
        responseSendStub.calledWith("Event with specified id does not exist"),
      ).to.be.true;
    });

    it("responds with error message if finding event fails with an error message", async () => {
      dummyParams = { id: "dummyId" };
      dummyRequest = { params: dummyParams };
      const dummyErrorWithMessage = new Error("dummyErrorWithMessage");
      eventFindByIdStub.throws(dummyErrorWithMessage);

      await eventsGetByIdCtrl(dummyRequest, dummyResponse);

      expect(eventFindByIdStub.calledWith("dummyId")).to.be.true;
      expect(
        consoleErrorStub.calledWith(
          "[controllers/events]",
          dummyErrorWithMessage,
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(500)).to.be.true;
      expect(responseSendStub.calledWith("dummyErrorWithMessage")).to.be.true;
    });

    it("responds with error message if finding event fails without an error message", async () => {
      dummyParams = { id: "dummyId" };
      dummyRequest = { params: dummyParams };
      const dummyErrorWithoutMessage = { message: undefined };
      eventFindByIdStub.throws(dummyErrorWithoutMessage);

      await eventsGetByIdCtrl(dummyRequest, dummyResponse);

      expect(eventFindByIdStub.calledWith("dummyId")).to.be.true;
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

  describe("eventsUpsertByIdCtrl()", () => {
    it("upserts the event at id with data", async () => {
      dummyParams = { id: "dummyId" };
      dummyBody = {
        event_name: "event_name",
        city_name: "city_name",
        date: "date",
        latitude: "latitude",
        longitude: "longitude",
      };
      dummyRequest = { params: dummyParams, body: dummyBody };
      const dummyEvent = "event";
      eventFindByIdAndUpdateStub.resolves(dummyEvent);

      await eventsUpsertByIdCtrl(dummyRequest, dummyResponse);

      expect(
        eventFindByIdAndUpdateStub.calledWith(
          "dummyId",
          {
            $set: dummyBody,
          },
          {
            upsert: true,
            new: true,
          },
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(responseJsonStub.calledWith({ event: dummyEvent })).to.be.true;
    });

    it("responds with error message if finding event fails with an error message", async () => {
      dummyParams = { id: "dummyId" };
      dummyBody = {};
      dummyRequest = { params: dummyParams, body: dummyBody };
      const dummyErrorWithMessage = new Error("dummyErrorWithMessage");
      eventFindByIdAndUpdateStub.throws(dummyErrorWithMessage);

      await eventsUpsertByIdCtrl(dummyRequest, dummyResponse);

      expect(
        eventFindByIdAndUpdateStub.calledWith(
          "dummyId",
          {
            $set: dummyBody,
          },
          {
            upsert: true,
            new: true,
          },
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(500)).to.be.true;
      expect(responseSendStub.calledWith("dummyErrorWithMessage")).to.be.true;
    });

    it("responds with error message if finding event fails without an error message", async () => {
      dummyParams = { id: "dummyId" };
      dummyBody = {};
      dummyRequest = { params: dummyParams, body: dummyBody };
      const dummyErrorWithoutMessage = { message: undefined };
      eventFindByIdAndUpdateStub.throws(dummyErrorWithoutMessage);

      await eventsUpsertByIdCtrl(dummyRequest, dummyResponse);

      expect(
        eventFindByIdAndUpdateStub.calledWith(
          "dummyId",
          {
            $set: dummyBody,
          },
          {
            upsert: true,
            new: true,
          },
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(500)).to.be.true;
      expect(responseSendStub.calledWith("Unknown error occurred")).to.be.true;
    });
  });

  describe("eventsDeleteByIdCtrl()", () => {
    it("deletes an event by it's id", async () => {
      dummyParams = { id: "dummyId" };
      dummyRequest = { params: dummyParams };
      const dummyEvent = "event";
      eventFindByIdAndDeleteStub.resolves(dummyEvent);

      await eventsDeleteByIdCtrl(dummyRequest, dummyResponse);

      expect(eventFindByIdAndDeleteStub.calledWith("dummyId")).to.be.true;
      expect(responseStatusStub.calledWith(200)).to.be.true;
      expect(responseJsonStub.calledWith({ event: dummyEvent })).to.be.true;
    });

    it("responds with error message if the event was not found", async () => {
      dummyParams = { id: "dummyId" };
      dummyRequest = { params: dummyParams };
      eventFindByIdAndDeleteStub.resolves(null);

      await eventsDeleteByIdCtrl(dummyRequest, dummyResponse);

      expect(eventFindByIdAndDeleteStub.calledWith("dummyId")).to.be.true;
      expect(responseStatusStub.calledWith(404)).to.be.true;
      expect(
        responseSendStub.calledWith("Event with specified id does not exist"),
      ).to.be.true;
    });

    it("responds with error message if deleting event fails with an error message", async () => {
      dummyParams = { id: "dummyId" };
      dummyRequest = { params: dummyParams };
      const dummyErrorWithMessage = new Error("dummyErrorWithMessage");
      eventFindByIdAndDeleteStub.throws(dummyErrorWithMessage);

      await eventsDeleteByIdCtrl(dummyRequest, dummyResponse);

      expect(eventFindByIdAndDeleteStub.calledWith("dummyId")).to.be.true;
      expect(
        consoleErrorStub.calledWith(
          "[controllers/events]",
          dummyErrorWithMessage,
        ),
      ).to.be.true;
      expect(responseStatusStub.calledWith(500)).to.be.true;
      expect(responseSendStub.calledWith("dummyErrorWithMessage")).to.be.true;
    });

    it("responds with error message if deleting event fails without an error message", async () => {
      dummyParams = { id: "dummyId" };
      dummyRequest = { params: dummyParams };
      const dummyErrorWithoutMessage = { message: undefined };
      eventFindByIdAndDeleteStub.throws(dummyErrorWithoutMessage);

      await eventsDeleteByIdCtrl(dummyRequest, dummyResponse);

      expect(eventFindByIdAndDeleteStub.calledWith("dummyId")).to.be.true;
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
