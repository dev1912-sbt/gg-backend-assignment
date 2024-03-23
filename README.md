# GG Assignment

A RESTful service that implements API to manage and query event data based on various parameters.

## 🛠️ Tech Stack

- Node.js
- Express.js

## 📊 Database

The database of choice is MongoDB, due to its flexible schema and native support for geospatial querying. With MongoDB, I can efficiently store and retrieve event data, including coordinates for location-based queries. This flexibility and built-in geospatial indexing make it an ideal choice for implementing APIs for events in this assignment.

## ▶ How to run?

Below are the steps to clone and run the project locally on your system:

1. Clone the repository by running:

   ```bash
   git clone https://github.com/dev1912-sbt/gg-backend-assignment.git
   ```

2. Open a Terminal inside the Project root.

3. Install required dependencies by running:

   ```bash
   npm install
   ```

   NOTE: If you do not wish to install the `devDependencies`, you can run the following command instead:

   ```bash
   npm install --omit=dev
   ```

   Please note that you will not be able to run the test cases if there are no `devDependencies` installed.

4. Create a ".env" file in the project root and insert the following fields:

   | Field             | Notes                                |
   | ----------------- | ------------------------------------ |
   | `PORT`            | Port for Express server to listen to |
   | `MONGOOSE_DB_URI` | Mongoose Connection String           |

5. (Optional) If you have installed the `devDependencies`, you can run the test cases by running:

   ```bash
   npm test
   ```

6. Start the application by running:

   ```bash
   npm start
   ```

## 📝 Documentation

You can find the API documentation in [docs/README.md](./docs/README.md).
