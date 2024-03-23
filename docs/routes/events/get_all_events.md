# Events API

## 📋 Get all Events

### Route: `/events`

### Method: `GET`

### Request Details

#### Query Parameters

| Field  | Notes                                                 |
| ------ | ----------------------------------------------------- |
| `page` | Page of events to display (Default is 1) _(Optional)_ |

### Successful Response details

#### Body

200 Response Content Type: `application/json`

```json
{
  "events": [
    {
      "_id": "string",
      "event_name": "string",
      "city_name": "string",
      "date": "iso_date",
      "coordinates": ["float", "float"],
      "createdAt": "iso_date",
      "updatedAt": "iso_date",
      "__v": "integer"
    }
  ],
  "page": "integer",
  "pageSize": "integer",
  "totalEvents": "integer",
  "totalPages": "integer"
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
| `page`        | Current page of events displayed                         |
| `pageSize`    | Current page size                                        |
| `totalEvents` | Total number of displayable events                       |
| `totalPages`  | Total number of available pages to display events        |

### Failed Response details

#### Body

Error Response Content Type: `text/plain`

| Error messages                               | Notes                                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| "Please specify a valid page to fetch"       | `page` is either not a valid integer, or is a non-positive integer (less than 1) |
| "Page specified exceeds the available pages" | `page` exceeds the available number of pages                                     |
| _Others_                                     | Internal server errors                                                           |
