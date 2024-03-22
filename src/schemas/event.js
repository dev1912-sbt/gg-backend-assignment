// Imports
import mongoose from "mongoose";

// Constants/Body
const schema = new mongoose.Schema(
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
);

const model = mongoose.model("event", schema);
export default model;
