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

export async function eventsGetAllCtrl(req, res) {
  try {
    const { query } = req;

    const { page = 1 } = query;

    const pageSize = 10;
    const totalEvents = await Event.countDocuments({});
    const totalPages = Math.ceil(totalEvents / pageSize);

    if (page > totalPages) {
      res.status(400).send("Page specified exceeds the available pages");
      return;
    }

    const events = await Event.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({ events, page, pageSize, totalEvents, totalPages });
  } catch (error) {
    console.error("[controllers/events]", error);
    res.status(500).send(error?.message ?? "Unknown error occurred");
  }
}
