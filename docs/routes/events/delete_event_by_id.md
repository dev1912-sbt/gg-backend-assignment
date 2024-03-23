# Events API

## 🗑️ Delete Events By ID

### Route: `/events/:id`

### Method: `DELETE`

### Request details

#### URL Parameters

| Field | Notes           |
| ----- | --------------- |
| `id`  | ID of the Event |

### Successful Response details

200 Response Content Type: `application/json`

```json
{
  "event": {
    "_id": "string",
    "event_name": "string",
    "city_name": "string",
    "date": "iso_date",
    "coordinates": ["float", "float"],
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

| Error messages                           | Notes                  |
| ---------------------------------------- | ---------------------- |
| "Please specify a valid event id"        | `id` is not valid      |
| "Event with specified id does not exist" | Event was not found    |
| _Others_                                 | Internal server errors |
