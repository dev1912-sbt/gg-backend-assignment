// Imports
import { Router } from "express";
import { param, query, body } from "express-validator";
import { expressValidatorErrorHandler } from "../middlewares/express_validator_error_handler.js";
import {
  eventsCreateCtrl,
  eventsGetAllCtrl,
  eventsGetByIdCtrl,
  EVENTS_FIND_SEARCHDATE_PATTERN,
  eventsFindCtrl,
  eventsUpsertByIdCtrl,
  eventsDeleteByIdCtrl,
} from "../controllers/events.js";

// Constants
const router = Router();

// Body
router.post(
  "/",
  body("event_name")
    .exists()
    .withMessage("Please provide event name")
    .notEmpty()
    .withMessage("Event name cannot be empty"),
  body("city_name")
    .exists()
    .withMessage("Please provide city name")
    .notEmpty()
    .withMessage("City name cannot be empty"),
  body("date")
    .exists()
    .withMessage("Please provide the event date")
    .isISO8601()
    .withMessage("Event date must be a valid date")
    .toDate(),
  body("latitude")
    .exists()
    .withMessage("Please provide the event latitude coordinate")
    .isFloat()
    .withMessage("Event latitude should be a valid floating-point number"),
  body("longitude")
    .exists()
    .withMessage("Please provide the event longitude coordinate")
    .isFloat()
    .withMessage("Event longitude should be a valid floating-point number"),
  expressValidatorErrorHandler,
  eventsCreateCtrl,
);

router.get(
  "/",
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Please specify a valid page to fetch"),
  expressValidatorErrorHandler,
  eventsGetAllCtrl,
);

router.get(
  "/find",
  query("srcLat")
    .exists()
    .withMessage("Please provide the source latitude")
    .isFloat()
    .withMessage("Source latitude should be a valid floating-point number")
    .toFloat(),
  query("srcLong")
    .exists()
    .withMessage("Please provide the source longitude")
    .isFloat()
    .withMessage("Source longitude should be a valid floating-point number")
    .toFloat(),
  query("searchDate")
    .exists()
    .withMessage("Please provide the search date")
    .matches(EVENTS_FIND_SEARCHDATE_PATTERN)
    .withMessage("Search date must be a valid date"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Please specify a valid page to fetch"),
  expressValidatorErrorHandler,
  eventsFindCtrl,
);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Please specify a valid event id"),
  expressValidatorErrorHandler,
  eventsGetByIdCtrl,
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("Please specify a valid event id"),
  body("event_name")
    .exists()
    .withMessage("Please provide event name")
    .notEmpty()
    .withMessage("Event name cannot be empty"),
  body("city_name")
    .exists()
    .withMessage("Please provide city name")
    .notEmpty()
    .withMessage("City name cannot be empty"),
  body("date")
    .exists()
    .withMessage("Please provide the event date")
    .isISO8601()
    .withMessage("Event date must be a valid date")
    .toDate(),
  body("latitude")
    .exists()
    .withMessage("Please provide the event latitude coordinate")
    .isFloat()
    .withMessage("Event latitude should be a valid floating-point number"),
  body("longitude")
    .exists()
    .withMessage("Please provide the event longitude coordinate")
    .isFloat()
    .withMessage("Event longitude should be a valid floating-point number"),
  expressValidatorErrorHandler,
  eventsUpsertByIdCtrl,
);

router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Please specify a valid event id"),
  expressValidatorErrorHandler,
  eventsDeleteByIdCtrl,
);

export default router;
