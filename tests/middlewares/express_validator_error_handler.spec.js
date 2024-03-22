import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("middlewares/express_validator_error_handler.js", () => {
  let validationResultIsEmptyStub;
  let validationResultArrayStub;
  const dummyValidationErrors = [
    {
      msg: "dummyValidationError",
    },
  ];
  const dummyValidationErrorsWithNoMessage = [
    {
      msg: undefined,
    },
  ];
  let dummyValidationResult;
  let expressValidatorValidationResultStub;

  let expressValidatorErrorHandler;

  let dummyRequest;

  let responseStatusStub;
  let responseSendStub;
  let dummyResponse;

  let nextStub;

  beforeEach(async () => {
    validationResultIsEmptyStub = sinon.stub();
    validationResultArrayStub = sinon.stub();
    dummyValidationResult = {
      isEmpty: validationResultIsEmptyStub,
      array: validationResultArrayStub,
    };
    expressValidatorValidationResultStub = sinon
      .stub()
      .returns(dummyValidationResult);
    const esmockImports = await esmock(
      "../../src/middlewares/express_validator_error_handler.js",
      {
        "express-validator": {
          validationResult: expressValidatorValidationResultStub,
        },
      },
    );
    expressValidatorErrorHandler = esmockImports.expressValidatorErrorHandler;

    dummyRequest = {};

    responseStatusStub = sinon.stub();
    responseSendStub = sinon.stub();
    dummyResponse = {
      status: responseStatusStub,
      send: responseSendStub,
    };
    responseStatusStub.returns(dummyResponse);

    nextStub = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("expressValidatorErrorHandler()", () => {
    it("handles express-validator error and responds with error message", () => {
      validationResultIsEmptyStub.returns(false);
      validationResultArrayStub.returns(dummyValidationErrors);

      expressValidatorErrorHandler(dummyRequest, dummyResponse, nextStub);

      expect(expressValidatorValidationResultStub.calledWith(dummyRequest)).to
        .be.true;
      expect(validationResultIsEmptyStub.called).to.be.true;
      expect(validationResultArrayStub.called).to.be.true;
      expect(responseStatusStub.calledWith(400)).to.be.true;
      expect(responseSendStub.calledWith("dummyValidationError")).to.be.true;
      expect(nextStub.called).to.be.false;
    });

    it("handles express-validator error and responds with generic error message if validation result message is not defined", () => {
      validationResultIsEmptyStub.returns(false);
      validationResultArrayStub.returns(dummyValidationErrorsWithNoMessage);

      expressValidatorErrorHandler(dummyRequest, dummyResponse, nextStub);

      expect(expressValidatorValidationResultStub.calledWith(dummyRequest)).to
        .be.true;
      expect(validationResultIsEmptyStub.called).to.be.true;
      expect(validationResultArrayStub.called).to.be.true;
      expect(responseStatusStub.calledWith(400)).to.be.true;
      expect(responseSendStub.calledWith("Unknown error occurred")).to.be.true;
      expect(nextStub.called).to.be.false;
    });

    it("proceeds immediately if there are no express-validator errors", () => {
      validationResultIsEmptyStub.returns(true);

      expressValidatorErrorHandler(dummyRequest, dummyResponse, nextStub);

      expect(expressValidatorValidationResultStub.calledWith(dummyRequest)).to
        .be.true;
      expect(validationResultIsEmptyStub.called).to.be.true;
      expect(nextStub.called).to.be.true;
    });
  });
});
