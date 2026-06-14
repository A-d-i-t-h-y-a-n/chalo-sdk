import express from "express";
import { ChaloSDK } from "../src/index.ts";

const app = express();
const sdk = new ChaloSDK();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chalo SDK API");
});

app.get("/planTrip", async (req, res) => {
  try {
    const trip = await sdk.planTrip({
      city: req.query.city,
      fromLat: Number(req.query.fromLat),
      fromLon: Number(req.query.fromLon),
      toLat: Number(req.query.toLat),
      toLon: Number(req.query.toLon),
    });

    res.json({
      status: trip.status,
      itineraries: trip.payload.itineraries.length,
      cheapestFare: Math.min(
        ...trip.payload.itineraries.map((i) => i.total_fare)
      ),
      payload: trip.payload,
    });
  } catch (e) {
    res.status(500).json({
      error: e?.response?.data ?? e.message,
    });
  }
});

app.get("/place/:placeId", async (req, res) => {
  try {
    const place = await sdk.getPlaceDetails({
      placeId: req.params.placeId,
    });

    res.json(place.result);
  } catch (e) {
    res.status(500).json({
      error: e?.response?.data ?? e.message,
    });
  }
});

app.get("/route/:city/:routeId", async (req, res) => {
  try {
    const route = await sdk.getRouteDetailsLive({
      city: req.params.city,
      routeId: req.params.routeId,
    });

    res.json({
      routeName: route.route.route_name,
      stops: route.route.stopSequenceWithDetails.length,
      trips: route.trips.length,
      firstTripStart: route.trips[0]?.start_time,
      data: route,
    });
  } catch (e) {
    res.status(500).json({
      error: e?.response?.data ?? e.message,
    });
  }
});

app.get("/live/:city/:routeId", async (req, res) => {
  try {
    const stopIds = req.query.stopIds
      ? String(req.query.stopIds).split(",")
      : [];

    const live = await sdk.getRouteLiveInfo({
      city: req.params.city,
      routeId: req.params.routeId,
      stopIds,
    });

    res.json(live);
  } catch (e) {
    res.status(500).json({
      error: e?.response?.data ?? e.message,
    });
  }
});

app.get("/track/:city/:routeId", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const tracker = sdk.trackRouteLive(
    {
      city: req.params.city,
      routeId: req.params.routeId,
      stopIds: req.query.stopIds
        ? String(req.query.stopIds).split(",")
        : [],
    },
    Number(req.query.interval ?? 10)
  );

  tracker.on("data", (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  tracker.start();

  req.on("close", () => {
    tracker.stop?.();
  });
});

app.listen(3000, () => {
  console.log("API running on :3000");
});