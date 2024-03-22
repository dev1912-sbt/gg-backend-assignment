import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("routes/events.js", () => {
  describe("POST /", () => {
    let routerGetStub;
    let routerPostStub;
    let routerPutStub;

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
      routerPutStub = sinon.stub();
      dummyRouter = {
        get: routerGetStub,
        post: routerPostStub,
        put: routerPutStub,
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
    let routerPutStub;

    let dummyRouter;
    let expressRouterStub;

    let bodyOptionalStub;
    let bodyIsIntStub;
    let bodyWithMessageStub;
    let dummyQuery;

    let expressValidatorQueryStub;
    let dummyExpressValidatorErrorHandler;
    let dummyEventsGetAllCtrl;

    let eventsRouter;

    beforeEach(async () => {
      routerGetStub = sinon.stub();
      routerPostStub = sinon.stub();
      routerPutStub = sinon.stub();
      dummyRouter = {
        get: routerGetStub,
        post: routerPostStub,
        put: routerPutStub,
      };
      expressRouterStub = sinon.stub().returns(dummyRouter);

      bodyOptionalStub = sinon.stub();
      bodyIsIntStub = sinon.stub();
      bodyWithMessageStub = sinon.stub().returns("page_validation");
      dummyQuery = {
        optional: bodyOptionalStub,
        isInt: bodyIsIntStub,
        withMessage: bodyWithMessageStub,
      };
      bodyOptionalStub.returns(dummyQuery);
      bodyIsIntStub.returns(dummyQuery);

      expressValidatorQueryStub = sinon.stub().returns(dummyQuery);
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

  describe("GET /:id", () => {
    let routerGetStub;
    let routerPostStub;
    let routerPutStub;
    let dummyRouter;
    let expressRouterStub;

    let dummyParam;
    let paramIsMongoIdStub;
    let paramWithMessageStub;

    let expressValidatorParamStub;
    let dummyExpressValidatorErrorHandler;
    let dummyEventsGetByIdCtrl;

    let eventsRouter;

    beforeEach(async () => {
      routerGetStub = sinon.stub();
      routerPostStub = sinon.stub();
      routerPutStub = sinon.stub();
      dummyRouter = {
        get: routerGetStub,
        post: routerPostStub,
        put: routerPutStub,
      };
      expressRouterStub = sinon.stub().returns(dummyRouter);

      paramIsMongoIdStub = sinon.stub();
      paramWithMessageStub = sinon.stub();
      dummyParam = {
        isMongoId: paramIsMongoIdStub,
        withMessage: paramWithMessageStub,
      };
      paramIsMongoIdStub.returns(dummyParam);
      paramWithMessageStub.returns("id_validation");

      expressValidatorParamStub = sinon.stub().returns(dummyParam);
      dummyExpressValidatorErrorHandler = {};
      dummyEventsGetByIdCtrl = {};
      const esmockImports = await esmock("../../src/routes/events.js", {
        express: {
          Router: expressRouterStub,
        },
        "express-validator": {
          param: expressValidatorParamStub,
        },
        "../../src/middlewares/express_validator_error_handler.js": {
          expressValidatorErrorHandler: dummyExpressValidatorErrorHandler,
        },
        "../../src/controllers/events.js": {
          eventsGetByIdCtrl: dummyEventsGetByIdCtrl,
        },
      });
      eventsRouter = esmockImports.default;
    });

    afterEach(() => {
      sinon.restore();
    });

    it("defines the route to get events by id", () => {
      expect(expressRouterStub.called).to.be.true;
      expect(
        routerGetStub.calledWith(
          "/:id",
          "id_validation",
          dummyExpressValidatorErrorHandler,
          dummyEventsGetByIdCtrl,
        ),
      ).to.be.true;
      sinon.assert.callOrder(
        expressValidatorParamStub.withArgs("id"),
        paramIsMongoIdStub,
        paramWithMessageStub.withArgs("Please specify a valid event id"),
      );
      expect(eventsRouter).to.be.equal(dummyRouter);
    });
  });

  describe("PUT /:id", () => {
    let routerGetStub;
    let routerPostStub;
    let routerPutStub;

    let dummyRouter;
    let expressRouterStub;

    let dummyParam;
    let paramIsMongoIdStub;
    let paramWithMessageStub;

    let dummyBody;
    let bodyExistsStub;
    let bodyWithMessageStub;
    let bodyNotEmptyStub;
    let bodyIsISO8601Stub;
    let bodyToDateStub;
    let bodyIsFloatStub;

    let expressValidatorParamStub;
    let expressValidatorBodyStub;
    let dummyExpressValidatorErrorHandler;
    let dummyEventsUpsertById;

    let eventsRouter;

    beforeEach(async () => {
      routerGetStub = sinon.stub();
      routerPostStub = sinon.stub();
      routerPutStub = sinon.stub();
      dummyRouter = {
        get: routerGetStub,
        post: routerPostStub,
        put: routerPutStub,
      };
      expressRouterStub = sinon.stub().returns(dummyRouter);

      paramIsMongoIdStub = sinon.stub();
      paramWithMessageStub = sinon.stub();
      dummyParam = {
        isMongoId: paramIsMongoIdStub,
        withMessage: paramWithMessageStub,
      };
      paramIsMongoIdStub.returns(dummyParam);
      paramWithMessageStub.returns("id_validation");

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

      expressValidatorParamStub = sinon.stub().returns(dummyParam);
      expressValidatorBodyStub = sinon.stub().returns(dummyBody);
      dummyExpressValidatorErrorHandler = {};
      dummyEventsUpsertById = {};
      const esmockImports = await esmock("../../src/routes/events.js", {
        express: {
          Router: expressRouterStub,
        },
        "express-validator": {
          param: expressValidatorParamStub,
          body: expressValidatorBodyStub,
        },
        "../../src/middlewares/express_validator_error_handler.js": {
          expressValidatorErrorHandler: dummyExpressValidatorErrorHandler,
        },
        "../../src/controllers/events.js": {
          eventsUpsertByIdCtrl: dummyEventsUpsertById,
        },
      });
      eventsRouter = esmockImports.default;
    });

    afterEach(() => {
      sinon.restore();
    });

    it("defines the route to upsert events by id", () => {
      expect(expressRouterStub.called).to.be.true;
      expect(
        routerPutStub.calledWith(
          "/:id",
          "id_validation",
          "event_name_validation",
          "city_name_validation",
          "date_validation",
          "latitude_validation",
          "longitude_validation",
          dummyExpressValidatorErrorHandler,
          dummyEventsUpsertById,
        ),
      ).to.be.true;
      sinon.assert.callOrder(
        expressValidatorParamStub.withArgs("id"),
        paramIsMongoIdStub,
        paramWithMessageStub.withArgs("Please specify a valid event id"),
      );
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
});
