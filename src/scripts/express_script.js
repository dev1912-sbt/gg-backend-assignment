// Imports
import express from "express";
import cors from "cors";
import eventsRoute from "../routes/events.js";

// Constants
const { PORT } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  }),
);

// Body
export function expressAppListenCallback() {
  console.log("[express_script]", "Express server running on port", PORT);
}

app.listen(PORT, expressAppListenCallback);

app.use("/events", eventsRoute);
