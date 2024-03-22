import { before, after } from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import esmock from "esmock";

describe("schemas/event.js", () => {
  let schemaIndexStub;
  let dummySchema;

  let mongooseSchemaStub;
  let mongooseModelStub;
  let dummyMongoose;

  let mongooseExports;

  before(async () => {
    schemaIndexStub = sinon.stub();
    dummySchema = {
      index: schemaIndexStub,
    };

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

  after(() => {
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
          latitude: {
            type: Number,
            required: true,
          },
          longitude: {
            type: Number,
            required: true,
          },
        },
        {
          timestamps: true,
        },
      ),
    ).to.be.true;
    expect(
      schemaIndexStub.calledWith({
        latitude: "2dsphere",
        longitude: "2dsphere",
      }),
    ).to.be.true;
    expect(mongooseModelStub.calledWith("event", dummySchema)).to.be.true;
    expect(mongooseExports).to.be.equal("mongooseModelStub");
  });
});
