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
);
schema.index({ latitude: "2dsphere", longitude: "2dsphere" });

const model = mongoose.model("event", schema);
export default model;
