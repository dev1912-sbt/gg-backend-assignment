import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";
import { createDummyExpressExport } from "./dummy_express.js";

describe("scripts/express_script.js", () => {
  let originalProcessEnv;
  let dummyProcessEnv;

  let expressAppUseStub;
  let expressAppListenStub;
  let dummyExpressApp;

  let expressJsonStub;
  let expressUrlencodedStub;
  let expressCallStub;
  let dummyExpressExport;

  let corsStub;

  let consoleLogStub;

  let dummyEventsRoute;

  let expressAppListenCallback;

  beforeEach(async () => {
    originalProcessEnv = process.env;
    dummyProcessEnv = {
      PORT: "dummyPort",
    };
    process.env = dummyProcessEnv;

    expressAppUseStub = sinon.stub();
    expressAppListenStub = sinon.stub();
    dummyExpressApp = {
      use: expressAppUseStub,
      listen: expressAppListenStub,
    };

    expressJsonStub = sinon.stub().returns("expressJsonStub");
    expressUrlencodedStub = sinon.stub().returns("expressUrlencodedStub");
    expressCallStub = sinon.stub();
    dummyExpressExport = createDummyExpressExport(
      expressJsonStub,
      expressUrlencodedStub,
      expressCallStub,
      dummyExpressApp,
    );

    corsStub = sinon.stub().returns("corsStub");

    consoleLogStub = sinon.stub(console, "log");

    dummyEventsRoute = {};
    const esmockImports = await esmock("../../src/scripts/express_script.js", {
      express: dummyExpressExport,
      cors: corsStub,
      "../../src/routes/events.js": dummyEventsRoute,
    });
    expressAppListenCallback = esmockImports.expressAppListenCallback;
  });

  afterEach(() => {
    process.env = originalProcessEnv;

    sinon.restore();
  });

  it("starts an express server", () => {
    expect(expressCallStub.called).to.be.true;
    expect(expressJsonStub.called).to.be.true;
    expect(expressAppUseStub.calledWith("expressJsonStub")).to.be.true;
    expect(expressUrlencodedStub.calledWith({ extended: true })).to.be.true;
    expect(expressAppUseStub.calledWith("expressUrlencodedStub")).to.be.true;
    expect(corsStub.calledWith({ origin: "*" })).to.be.true;
    expect(expressAppUseStub.calledWith("corsStub")).to.be.true;
    expect(
      expressAppListenStub.calledWith(
        dummyProcessEnv.PORT,
        expressAppListenCallback,
      ),
    ).to.be.true;
    expect(expressAppUseStub.calledWith("/events", dummyEventsRoute)).to.be
      .true;
  });

  describe("expressAppListenCallback()", () => {
    it("logs server status to console", () => {
      expressAppListenCallback();

      expect(
        consoleLogStub.calledWith(
          "[express_script]",
          "Express server running on port",
          "dummyPort",
        ),
      ).to.be.true;
    });
  });
});
