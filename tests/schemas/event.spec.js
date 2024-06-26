import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("schemas/event.js", () => {
  let dummySchema;

  let mongooseSchemaStub;
  let mongooseModelStub;
  let dummyMongoose;

  let mongooseExports;

  beforeEach(async () => {
    dummySchema = {};

    mongooseSchemaStub = sinon.stub().returns(dummySchema);
    mongooseModelStub = sinon.stub().returns("mongooseModelStub");
    dummyMongoose = {
      Schema: mongooseSchemaStub,
      model: mongooseModelStub,
    };

    const esmockImports = await esmock("../../src/schemas/event.js", {
      mongoose: dummyMongoose,
    });
    mongooseExports = esmockImports.default;
  });

  afterEach(() => {
    sinon.restore();
  });

  it("defines and models the event schema", () => {
    expect(
      mongooseSchemaStub.calledWith(
        {
          event_name: {
            type: String,
            required: true,
            trim: true,
          },
          city_name: {
            type: String,
            required: true,
            trim: true,
          },
          date: {
            type: Date,
            required: true,
          },
          coordinates: {
            type: [Number],
            required: true,
            index: "2dsphere",
          },
        },
        {
          timestamps: true,
        },
      ),
    ).to.be.true;
    expect(mongooseModelStub.calledWith("event", dummySchema)).to.be.true;
    expect(mongooseExports).to.be.equal("mongooseModelStub");
  });
});
