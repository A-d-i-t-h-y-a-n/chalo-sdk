# chalo-sdk

Unofficial Node.js/TypeScript SDK for the [Chalo](https://chalo.com) API. Track buses, plan trips, and get live location updates.

> Not affiliated with Chalo. Use at your own risk.

## Install

```bash
npm install chalo-sdk
```

install the latest GitHub version (recommended):

```bash
npm install github:A-d-i-t-h-y-a-n/chalo-sdk
```

## Usage

```ts
import { ChaloSDK } from "chalo-sdk";
// or
const { ChaloSDK } = require("chalo-sdk");

const chalo = new ChaloSDK();
```

---

## Methods

### `search(params)`

Search for bus routes, stops, or places in a city.

```ts
const results = await chalo.search({
  city: "ernakulam",
  query: "Aluva",
  location: { lat: 9.986, lon: 76.274 }
});

console.log(results.data.routes);
console.log(results.data.stopsAndPlaces);
```

**Params:**

| Field | Type | Required | Description |
|---|---|---|---|
| `city` | `string` | ✓ | City slug (e.g. `"bangalore"`) |
| `query` | `string` | ✓ | Search term |
| `location` | `{ lat, lon }` | ✓ | Bias results near a location |

---

### `planTrip(params)`

Get itineraries between two coordinates.

```ts
const trip = await chalo.planTrip({
  city: "ernakulam",
  fromLat: 9.986,
  fromLon: 76.274,
  toLat: 10.110,
  toLon: 76.348,
});

for (const itinerary of trip.payload.itineraries) {
  console.log(`From ${itinerary.legs[0].end_place_name} In ${(itinerary.time_taken / 60) | 0} mins — ₹${itinerary.total_fare}`);
}
```

**Params:**

| Field | Type | Required | Description |
|---|---|---|---|
| `city` | `string` | ✓ | City slug |
| `fromLat` / `fromLon` | `number` | ✓ | Origin coordinates |
| `toLat` / `toLon` | `number` | ✓ | Destination coordinates |
| `numItineraries` | `number` | | How many results to return |
| `maxWalkDistance` | `number` | | Max walk distance in meters |
| `ac` / `nonac` | `boolean` | | Filter AC/non-AC buses |

---

### `trackRouteLive(params, intervalSeconds?)`

Poll live bus positions for a route at a given stop. Returns a `RouteLiveTracker` instance.

```ts
const tracker = chalo.trackRouteLive({
  city: "ernakulam",
  routeId: "your-route-id",
  stopIds: ["stop-id"],
}, 15); // poll every 15 seconds

tracker.on("data", (info) => {
  console.log(info.stopsEta);
});

tracker.on("error", (err) => {
  console.error(err);
});

tracker.start();

// stop when done
tracker.stop();
```

**Params:**

| Field | Type | Required | Description |
|---|---|---|---|
| `city` | `string` | ✓ | City slug |
| `routeId` | `string` | ✓ | Route ID |
| `stopIds` | `string \| string[]` | ✓ | Stop ID(s) to track |
| `intervalSeconds` | `number` | | Poll interval, default `10` |

---

## Auth (optional)

Some features work without auth. For authenticated requests:

```ts
await chalo.requestOtp({ phoneNumber: "9999999999", countryCode: "91" });

const session = await chalo.login({
  mobileNumber: "9999999999",
  countryCode: "91",
  refNo: "...",
  otp: "123456",
});
```

pass auth directly:

```ts
const chalo = new ChaloSDK({
  auth: {
    accessToken: "...",
    deviceId: "...",
    userId: "...",
  },
});
```

---

## License

MIT © [Adithyan R](https://github.com/A-d-i-t-h-y-a-n)
