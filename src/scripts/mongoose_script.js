// Imports
import mongoose from "mongoose";

// Constants
const { MONGOOSE_DB_URI } = process.env;

// Body
export function mongooseOnConnectionCallback() {
  console.log("[mongoose_script]", "Connected to DB");
}
export function mongooseOnDisconnectionCallback() {
  console.log("[mongoose_script]", "Disconnected from DB");
}
export function mongooseOnErrorCallback(error) {
  console.error("[mongoose_script]", error);
}

mongoose.connection.on("connected", mongooseOnConnectionCallback);
mongoose.connection.on("disconnected", mongooseOnDisconnectionCallback);
mongoose.connection.on("error", mongooseOnErrorCallback);

mongoose.connect(MONGOOSE_DB_URI);
