import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";
import mongoose from "mongoose";

describe("scripts/mongoose_script.js", () => {
  let originalProcessEnv;
  let dummyProcessEnv;

  let consoleLogStub;
  let consoleErrorStub;

  let mongooseConnectionOnStub;
  let mongooseConnectStub;

  let mongooseOnConnectionCallback;
  let mongooseOnDisconnectionCallback;
  let mongooseOnErrorCallback;

  beforeEach(async () => {
    originalProcessEnv = process.env;
    dummyProcessEnv = {
      MONGOOSE_DB_URI: "dummyMongooseDbUri",
    };
    process.env = dummyProcessEnv;

    consoleLogStub = sinon.stub(console, "log");
    consoleErrorStub = sinon.stub(console, "error");

    mongooseConnectionOnStub = sinon.stub(mongoose.connection, "on");
    mongooseConnectStub = sinon.stub();
    const esmockImports = await esmock("../../src/scripts/mongoose_script.js", {
      mongoose: {
        connect: mongooseConnectStub,
      },
    });
    mongooseOnConnectionCallback = esmockImports.mongooseOnConnectionCallback;
    mongooseOnDisconnectionCallback =
      esmockImports.mongooseOnDisconnectionCallback;
    mongooseOnErrorCallback = esmockImports.mongooseOnErrorCallback;
  });

  afterEach(() => {
    process.env = originalProcessEnv;

    sinon.restore();
  });

  it("sets event handlers and attempts to connect to db", () => {
    expect(
      mongooseConnectionOnStub.calledWith(
        "connected",
        mongooseOnConnectionCallback,
      ),
    ).to.be.true;
    expect(
      mongooseConnectionOnStub.calledWith(
        "disconnected",
        mongooseOnDisconnectionCallback,
      ),
    ).to.be.true;
    expect(
      mongooseConnectionOnStub.calledWith("error", mongooseOnErrorCallback),
    ).to.be.true;
    expect(mongooseConnectStub.calledWith("dummyMongooseDbUri")).to.be.true;
  });

  describe("mongooseOnConnectionCallback()", () => {
    it("logs status message to console", () => {
      mongooseOnConnectionCallback();

      expect(consoleLogStub.calledWith("[mongoose_script]", "Connected to DB"))
        .to.be.true;
    });
  });

  describe("mongooseOnDisconnectionCallback()", () => {
    it("logs status message to console", () => {
      mongooseOnDisconnectionCallback();

      expect(
        consoleLogStub.calledWith("[mongoose_script]", "Disconnected from DB"),
      ).to.be.true;
    });
  });

  describe("mongooseOnErrorCallback()", () => {
    it("logs error message to console", () => {
      const dummyError = new Error();

      mongooseOnErrorCallback(dummyError);

      expect(consoleErrorStub.calledWith("[mongoose_script]", dummyError)).to.be
        .true;
    });
  });
});
