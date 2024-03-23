# Events API

## ➕ Create an Event

### Route: `/events`

### Method: `POST`

### Request details

#### Body

Request Content Type: `application/json`

```json
{
  "event_name": "string",
  "city_name": "string",
  "date": "iso_date",
  "latitude": "float",
  "longitude": "float"
}
```

| Field        | Notes                                      |
| ------------ | ------------------------------------------ |
| `event_name` | Name of the Event                          |
| `city_name`  | Name of the City where the event is hosted |
| `date`       | Date of the event                          |
| `latitude`   | Latitude of the event's location           |
| `longitude`  | Longitude of the event's location          |

### Successful Response details

201 Response Content Type: `application/json`

```json
{
  "event": {
    "event_name": "string",
    "city_name": "string",
    "date": "iso_date",
    "coordinates": ["float", "float"],
    "_id": "string",
    "createdAt": "iso_date",
    "updatedAt": "iso_date",
    "__v": "integer"
  }
}
```

| Field         | Notes                                                    |
| ------------- | -------------------------------------------------------- |
| `_id`         | ID of the Event                                          |
| `event_name`  | Name of the Event                                        |
| `city_name`   | Name of the City where the event is hosted               |
| `date`        | Date of the event                                        |
| `coordinates` | Coordinates of the Event, longitude followed by latitude |
| `createdAt`   | Event creation date                                      |
| `updatedAt`   | Event last updated date                                  |
| `_v`          | Event update version number                              |

### Failed Response details

#### Body

Error Response Content Type: `text/plain`

| Error messages                                            | Notes                               |
| --------------------------------------------------------- | ----------------------------------- |
| "Please provide event name"                               | `event_name` is not provided        |
| "Event name cannot be empty"                              | `event_name` is empty               |
| "Please provide city name"                                | `city_name` is not provided         |
| "City name cannot be empty"                               | `city_name` is empty                |
| "Please provide the event date"                           | `date` is not provided              |
| "Event date must be a valid date"                         | `date` is not a valid ISO-8601 date |
| "Please provide the event latitude coordinate"            | `latitude` is not provided          |
| "Event latitude should be a valid floating-point number"  | `latitude` is not a valid float     |
| "Please provide the event longitude coordinate"           | `longitude` is not provided         |
| "Event longitude should be a valid floating-point number" | `longitude` is not a valid float    |
| _Others_                                                  | Internal server errors              |
