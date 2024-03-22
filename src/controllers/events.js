// Imports
import Event from "../schemas/event.js";

// Constants/Body
export async function eventsCreateCtrl(req, res) {
  try {
    const { body } = req;

    const { event_name, city_name, date, latitude, longitude } = body;

    const event = await Event.create({
      event_name,
      city_name,
      date,
      coordinates: [latitude, longitude],
    });

    res.status(201).json({ event });
  } catch (error) {
    console.error("[controllers/events]", error);
    res.status(500).send(error?.message ?? "Unknown error occurred");
  }
}
