# Events API

## 🔍 Find Events

### Route: `/events/find`

### Method: `/GET`

### Request details

#### Query Parameters

| Field        | Notes                                                 |
| ------------ | ----------------------------------------------------- |
| `srcLat`     | Source latitude to search Events around               |
| `srcLong`    | Source longitude to search Events around              |
| `searchDate` | Min. event start date to search from                  |
| `page`       | Page of events to display (Default is 1) _(Optional)_ |

### Successful Response details

200 Response Content Type: `application/json`

```json
{
  "events": [
    {
      "event_name": "string",
      "city_name": "string",
      "date": "iso_date",
      "weather": "string",
      "distance_km": "float"
    }
  ],
  "page": "integer",
  "pageSize": "integer",
  "totalEvents": "integer",
  "totalPages": "integer"
}
```

| Field         | Notes                                               |
| ------------- | --------------------------------------------------- |
| `event_name`  | Name of the Event                                   |
| `city_name`   | Name of the City where the event is hosted          |
| `date`        | Date of the event                                   |
| `weather`     | Weather status at given Event's location            |
| `distance_km` | Distance between source and the Event in Kilometres |
| `page`        | Current page of events displayed                    |
| `pageSize`    | Current page size                                   |
| `totalEvents` | Total number of displayable events                  |
| `totalPages`  | Total number of available pages to display events   |

204 Response Content Type: `text/plain`

| Messages               | Notes                          |
| ---------------------- | ------------------------------ |
| "No events to display" | There are no events to display |

### Failed Response details

#### Body

Error Response Content Type: `text/plain`

| Error messages                                             | Notes                                                                            |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| "Please provide the source latitude"                       | `srcLat` is not provided                                                         |
| "Source latitude should be a valid floating-point number"  | `srcLat` is not a valid float                                                    |
| "Please provide the source longitude"                      | `srcLong` is not provided                                                        |
| "Source longitude should be a valid floating-point number" | `srcLong` is not a valid float                                                   |
| "Please provide the search date"                           | `searchDate` is not provided                                                     |
| "Search date must be a valid date"                         | `searchDate` is not a valid ISO-8601 date                                        |
| "Please specify a valid page to fetch"                     | `page` is either not a valid integer, or is a non-positive integer (less than 1) |
| "Page specified exceeds the available pages"               | `page` exceeds the available number of pages                                     |
| _Others_                                                   | Internal server errors                                                           |
