// Imports
import { Router } from "express";
import { query, body } from "express-validator";
import { expressValidatorErrorHandler } from "../middlewares/express_validator_error_handler.js";
import { eventsCreateCtrl, eventsGetAllCtrl } from "../controllers/events.js";

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

export default router;
