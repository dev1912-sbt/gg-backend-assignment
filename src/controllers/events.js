// Imports
import Event from "../schemas/event.js";
import {
  convertIndianDateToZuluDate,
  addDaysToDate,
} from "../utils/temporal.js";
import { fillEventWithWeatherAndDistance } from "../services/events.js";

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

    res
      .status(200)
      .json({ events, page, pageSize: events.length, totalEvents, totalPages });
  } catch (error) {
    console.error("[controllers/events]", error);
    res.status(500).send(error?.message ?? "Unknown error occurred");
  }
}

export const EVENTS_FIND_SEARCHDATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export async function eventsFindCtrl(req, res) {
  try {
    const { query } = req;

    const { srcLat, srcLong, searchDate, page = 1 } = query;

    const sameSearchDate = new Date(searchDate);
    const zuluSearchDate = convertIndianDateToZuluDate(sameSearchDate);
    const zuluSearchDateAfter14Days = addDaysToDate(zuluSearchDate, 14);

    const pageSize = 10;

    const aggregationResult = await Event.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [srcLong, srcLat],
          },
          distanceField: "dist_calculated",
          includeLocs: "coordinates",
        },
      },
      {
        $match: {
          date: {
            $gte: zuluSearchDate,
            $lte: zuluSearchDateAfter14Days,
          },
        },
      },
      { $sort: { date: 1 } },
      { $unset: ["_id", "dist_calculated"] },
      {
        $group: {
          _id: "aggregation",
          events: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
      {
        $set: {
          events: { $slice: ["$events", (page - 1) * pageSize, pageSize] },
        },
      },
    ]);
    if (aggregationResult.length === 0) {
      res.status(204).send("No events to display");
      return;
    }

    const events = aggregationResult[0].events;
    const totalEvents = aggregationResult[0].count;
    const totalPages = Math.ceil(totalEvents / pageSize);

    if (page > totalPages) {
      res.status(400).send("Page specified exceeds the available pages");
      return;
    }

    const filledEventsPromises = events.map(async (event) => {
      const filledEvent = await fillEventWithWeatherAndDistance(
        event,
        srcLat,
        srcLong,
      );
      if (filledEvent === null) return event;

      delete filledEvent.coordinates;

      return filledEvent;
    });
    const filledEvents = await Promise.all(filledEventsPromises);

    res.status(200).json({
      events: filledEvents,
      page,
      pageSize: filledEvents.length,
      totalEvents,
      totalPages,
    });
  } catch (error) {
    console.error("[controllers/events]", error);
    res.status(500).send(error?.message ?? "Unknown error occurred");
  }
}

export async function eventsGetByIdCtrl(req, res) {
  try {
    const { params } = req;

    const { id } = params;

    const event = await Event.findById(id);
    if (event === null) {
      return res.status(404).send("Event with specified id does not exist");
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error("[controllers/events]", error);
    res.status(500).send(error?.message ?? "Unknown error occurred");
  }
}

export async function eventsUpsertByIdCtrl(req, res) {
  try {
    const { params, body } = req;

    const { id } = params;

    const event = await Event.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      {
        upsert: true,
        new: true,
      },
    );

    res.status(200).json({ event });
  } catch (error) {
    console.error("[controllers/events]", error);
    res.status(500).send(error?.message ?? "Unknown error occurred");
  }
}

export async function eventsDeleteByIdCtrl(req, res) {
  try {
    const { params } = req;

    const { id } = params;

    const event = await Event.findByIdAndDelete(id);
    if (event === null) {
      return res.status(404).send("Event with specified id does not exist");
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error("[controllers/events]", error);
    res.status(500).send(error?.message ?? "Unknown error occurred");
  }
}
