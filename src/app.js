// Cache environment variables
import dotenv from "dotenv";
dotenv.config();

// Connect to DB
import("./scripts/mongoose_script.js");

// Start Express server
import("./scripts/express_script.js");
