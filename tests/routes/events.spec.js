import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("routes/events.js", () => {
  let routerGetStub;
  let routerPostStub;
  let routerPutStub;
  let routerDeleteStub;

  let dummyRouter;
  let expressRouterStub;

  let paramIsMongoIdStub;
  let paramWithMessageStub;
  let dummyParam;

  let queryOptionalStub;
  let queryIsIntStub;
  let queryIsFloatStub;
  let queryWithMessageStub;
  let dummyQuery;

  let bodyExistsStub;
  let bodyWithMessageStub;
  let bodyNotEmptyStub;
  let bodyIsISO8601Stub;
  let bodyToDateStub;
  let bodyIsFloatStub;
  let dummyBody;

  let expressValidatorParamStub;
  let expressValidatorQueryStub;
  let expressValidatorBodyStub;
  let dummyExpressValidatorErrorHandler;
  let dummyEventsCreate;
  let dummyEventsGetAllCtrl;
  let dummyEventsGetByIdCtrl;
  let dummyEventsUpsertById;
  let dummyEventsDeleteByIdCtrl;

  let eventsRouter;

  beforeEach(async () => {
    routerGetStub = sinon.stub();
    routerPostStub = sinon.stub();
    routerPutStub = sinon.stub();
    routerDeleteStub = sinon.stub();
    dummyRouter = {
      get: routerGetStub,
      post: routerPostStub,
      put: routerPutStub,
      delete: routerDeleteStub,
    };
    expressRouterStub = sinon.stub().returns(dummyRouter);

    paramIsMongoIdStub = sinon.stub();
    paramWithMessageStub = sinon.stub();
    dummyParam = {
      isMongoId: paramIsMongoIdStub,
      withMessage: paramWithMessageStub,
    };
    paramIsMongoIdStub.returns(dummyParam);
    paramWithMessageStub.returns(dummyParam);

    queryOptionalStub = sinon.stub();
    queryIsIntStub = sinon.stub();
    queryIsFloatStub = sinon.stub();
    queryWithMessageStub = sinon.stub();
    dummyQuery = {
      optional: queryOptionalStub,
      isInt: queryIsIntStub,
      isFloat: queryIsFloatStub,
      withMessage: queryWithMessageStub,
    };
    queryOptionalStub.returns(dummyQuery);
    queryIsIntStub.returns(dummyQuery);
    queryIsFloatStub.returns(dummyQuery);
    queryWithMessageStub.returns(dummyQuery);

    bodyExistsStub = sinon.stub();
    bodyWithMessageStub = sinon.stub();
    bodyNotEmptyStub = sinon.stub();
    bodyIsISO8601Stub = sinon.stub();
    bodyToDateStub = sinon.stub();
    bodyIsFloatStub = sinon.stub();
    dummyBody = {
      exists: bodyExistsStub,
      withMessage: bodyWithMessageStub,
      notEmpty: bodyNotEmptyStub,
      isISO8601: bodyIsISO8601Stub,
      isFloat: bodyIsFloatStub,
      toDate: bodyToDateStub,
    };
    bodyExistsStub.returns(dummyBody);
    bodyWithMessageStub.returns(dummyBody);
    bodyNotEmptyStub.returns(dummyBody);
    bodyIsISO8601Stub.returns(dummyBody);
    bodyToDateStub.returns(dummyBody);
    bodyIsFloatStub.returns(dummyBody);

    expressValidatorParamStub = sinon.stub().returns(dummyParam);
    expressValidatorQueryStub = sinon.stub().returns(dummyQuery);
    expressValidatorBodyStub = sinon.stub().returns(dummyBody);
    dummyExpressValidatorErrorHandler = {};
    dummyEventsCreate = {};
    const esmockImports = await esmock("../../src/routes/events.js", {
      express: {
        Router: expressRouterStub,
      },
      "express-validator": {
        param: expressValidatorParamStub,
        query: expressValidatorQueryStub,
        body: expressValidatorBodyStub,
      },
      "../../src/middlewares/express_validator_error_handler.js": {
        expressValidatorErrorHandler: dummyExpressValidatorErrorHandler,
      },
      "../../src/controllers/events.js": {
        eventsCreateCtrl: dummyEventsCreate,
        eventsGetAllCtrl: dummyEventsGetAllCtrl,
        eventsGetByIdCtrl: dummyEventsGetByIdCtrl,
        eventsUpsertByIdCtrl: dummyEventsUpsertById,
        eventsDeleteByIdCtrl: dummyEventsDeleteByIdCtrl,
      },
    });
    eventsRouter = esmockImports.default;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("POST /", () => {
    it("defines the route to create events", () => {
      expect(expressRouterStub.called).to.be.true;
      expect(
        routerPostStub.calledWith(
          "/",
          dummyBody,
          dummyBody,
          dummyBody,
          dummyBody,
          dummyBody,
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
    it("defines the route to get all events", () => {
      expect(expressRouterStub.called).to.be.true;
      expect(
        routerGetStub.calledWith(
          "/",
          dummyQuery,
          dummyExpressValidatorErrorHandler,
          dummyEventsGetAllCtrl,
        ),
      ).to.be.true;
      sinon.assert.callOrder(
        expressValidatorQueryStub.withArgs("page"),
        queryOptionalStub,
        queryIsIntStub.withArgs({ min: 1 }),
        queryWithMessageStub.withArgs("Please specify a valid page to fetch"),
      );
      expect(eventsRouter).to.be.equal(dummyRouter);
    });
  });

  describe("GET /:id", () => {
    it("defines the route to get events by id", () => {
      expect(expressRouterStub.called).to.be.true;
      expect(
        routerGetStub.calledWith(
          "/:id",
          dummyParam,
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
    it("defines the route to upsert events by id", () => {
      expect(expressRouterStub.called).to.be.true;
      expect(
        routerPutStub.calledWith(
          "/:id",
          dummyParam,
          dummyBody,
          dummyBody,
          dummyBody,
          dummyBody,
          dummyBody,
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

  describe("DELETE /:id", () => {
    it("defines the route to delete events by id", () => {
      expect(expressRouterStub.called).to.be.true;
      expect(
        routerDeleteStub.calledWith(
          "/:id",
          dummyParam,
          dummyExpressValidatorErrorHandler,
          dummyEventsDeleteByIdCtrl,
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
});
