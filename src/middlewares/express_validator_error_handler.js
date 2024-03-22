// Imports
import { validationResult } from "express-validator";

// Constants/Body
export function expressValidatorErrorHandler(req, res, next) {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errorMessage =
      validationErrors.array()[0].msg ?? "Unknown error occurred";
    return res.status(400).send(errorMessage);
  }

  next();
}
