import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("routes/events.js", () => {
  describe("POST /", () => {
    let routerGetStub;
    let routerPostStub;
    let dummyRouter;
    let expressRouterStub;

    let dummyBody;
    let bodyExistsStub;
    let bodyWithMessageStub;
    let bodyNotEmptyStub;
    let bodyIsISO8601Stub;
    let bodyToDateStub;
    let bodyIsFloatStub;

    let expressValidatorBodyStub;
    let dummyExpressValidatorErrorHandler;
    let dummyEventsCreate;

    let eventsRouter;

    beforeEach(async () => {
      routerGetStub = sinon.stub();
      routerPostStub = sinon.stub();
      dummyRouter = {
        get: routerGetStub,
        post: routerPostStub,
      };
      expressRouterStub = sinon.stub().returns(dummyRouter);

      bodyExistsStub = sinon.stub();
      bodyWithMessageStub = sinon.stub();
      bodyWithMessageStub
        .withArgs("Event name cannot be empty")
        .returns("event_name_validation")
        .withArgs("City name cannot be empty")
        .returns("city_name_validation")
        .withArgs("Event latitude should be a valid floating-point number")
        .returns("latitude_validation")
        .withArgs("Event longitude should be a valid floating-point number")
        .returns("longitude_validation");
      bodyNotEmptyStub = sinon.stub();
      bodyIsISO8601Stub = sinon.stub();
      bodyToDateStub = sinon.stub().returns("date_validation");
      bodyIsFloatStub = sinon.stub();
      dummyBody = {
        exists: bodyExistsStub,
        withMessage: bodyWithMessageStub,
        notEmpty: bodyNotEmptyStub,
        isISO8601: bodyIsISO8601Stub,
        toDate: bodyToDateStub,
        isFloat: bodyIsFloatStub,
      };
      bodyWithMessageStub
        .withArgs("Event date must be a valid date")
        .returns(dummyBody);
      bodyExistsStub.returns(dummyBody);
      bodyWithMessageStub.returns(dummyBody);
      bodyNotEmptyStub.returns(dummyBody);
      bodyIsISO8601Stub.returns(dummyBody);
      bodyIsFloatStub.returns(dummyBody);

      expressValidatorBodyStub = sinon.stub().returns(dummyBody);
      dummyExpressValidatorErrorHandler = {};
      dummyEventsCreate = {};
      const esmockImports = await esmock("../../src/routes/events.js", {
        express: {
          Router: expressRouterStub,
        },
        "express-validator": {
          body: expressValidatorBodyStub,
        },
        "../../src/middlewares/express_validator_error_handler.js": {
          expressValidatorErrorHandler: dummyExpressValidatorErrorHandler,
        },
        "../../src/controllers/events.js": {
          eventsCreateCtrl: dummyEventsCreate,
        },
      });
      eventsRouter = esmockImports.default;
    });

    afterEach(() => {
      sinon.restore();
    });

    it("defines the route to create events", () => {
      expect(expressRouterStub.called).to.be.true;
      expect(
        routerPostStub.calledWith(
          "/",
          "event_name_validation",
          "city_name_validation",
          "date_validation",
          "latitude_validation",
          "longitude_validation",
          dummyExpressValidatorErrorHandler,
          dummyEventsCreate,
        ),
      ).to.be.true;
      sinon.assert.callOrder(
        expressValidatorBodyStub.withArgs("event_name"),
        bodyWithMessageStub.withArgs("Please provide event name"),
        bodyNotEmptyStub,
        bodyWithMessageStub.withArgs("Event name cannot be empty"),
      );
      sinon.assert.callOrder(
        expressValidatorBodyStub.withArgs("city_name"),
        bodyWithMessageStub.withArgs("Please provide city name"),
        bodyNotEmptyStub,
        bodyWithMessageStub.withArgs("City name cannot be empty"),
      );
      sinon.assert.callOrder(
        expressValidatorBodyStub.withArgs("date"),
        bodyWithMessageStub.withArgs("Please provide the event date"),
        bodyIsISO8601Stub,
        bodyWithMessageStub.withArgs("Event date must be a valid date"),
        bodyToDateStub,
      );
      sinon.assert.callOrder(
        expressValidatorBodyStub.withArgs("latitude"),
        bodyWithMessageStub.withArgs(
          "Please provide the event latitude coordinate",
        ),
        bodyIsFloatStub,
        bodyWithMessageStub.withArgs(
          "Event latitude should be a valid floating-point number",
        ),
      );
      sinon.assert.callOrder(
        expressValidatorBodyStub.withArgs("longitude"),
        bodyWithMessageStub.withArgs(
          "Please provide the event longitude coordinate",
        ),
        bodyIsFloatStub,
        bodyWithMessageStub.withArgs(
          "Event longitude should be a valid floating-point number",
        ),
      );
      expect(eventsRouter).to.be.equal(dummyRouter);
    });
  });

  describe("GET /", () => {
    let routerGetStub;
    let routerPostStub;
    let dummyRouter;
    let expressRouterStub;

    let bodyOptionalStub;
    let bodyIsIntStub;
    let bodyWithMessageStub;
    let dummyBody;

    let expressValidatorQueryStub;
    let dummyExpressValidatorErrorHandler;
    let dummyEventsGetAllCtrl;

    let eventsRouter;

    beforeEach(async () => {
      routerGetStub = sinon.stub();
      routerPostStub = sinon.stub();
      dummyRouter = {
        get: routerGetStub,
        post: routerPostStub,
      };
      expressRouterStub = sinon.stub().returns(dummyRouter);

      bodyOptionalStub = sinon.stub();
      bodyIsIntStub = sinon.stub();
      bodyWithMessageStub = sinon.stub().returns("page_validation");
      dummyBody = {
        optional: bodyOptionalStub,
        isInt: bodyIsIntStub,
        withMessage: bodyWithMessageStub,
      };
      bodyOptionalStub.returns(dummyBody);
      bodyIsIntStub.returns(dummyBody);

      expressValidatorQueryStub = sinon.stub().returns(dummyBody);
      dummyExpressValidatorErrorHandler = {};
      dummyEventsGetAllCtrl = {};
      const esmockImports = await esmock("../../src/routes/events.js", {
        express: {
          Router: expressRouterStub,
        },
        "express-validator": {
          query: expressValidatorQueryStub,
        },
        "../../src/middlewares/express_validator_error_handler.js": {
          expressValidatorErrorHandler: dummyExpressValidatorErrorHandler,
        },
        "../../src/controllers/events.js": {
          eventsGetAllCtrl: dummyEventsGetAllCtrl,
        },
      });
      eventsRouter = esmockImports.default;
    });

    afterEach(() => {
      sinon.restore();
    });

    it("defines the route to get all events", () => {
      expect(expressRouterStub.called).to.be.true;
      expect(
        routerGetStub.calledWith(
          "/",
          "page_validation",
          dummyExpressValidatorErrorHandler,
          dummyEventsGetAllCtrl,
        ),
      ).to.be.true;
      sinon.assert.callOrder(
        expressValidatorQueryStub.withArgs("page"),
        bodyOptionalStub,
        bodyIsIntStub.withArgs({ min: 1 }),
        bodyWithMessageStub.withArgs("Please specify a valid page to fetch"),
      );
      expect(eventsRouter).to.be.equal(dummyRouter);
    });
  });
});
