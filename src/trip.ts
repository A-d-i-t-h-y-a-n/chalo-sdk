import { AxiosInstance } from "axios";
import {
  AuthState,
  TripPlannerParams,
  TripPlannerResponse,
  PlaceDetailsParams,
  PlaceDetailsResponse,
  RouteDetailsParams,
  RouteDetailsLiveResponse
} from "./types";
import { randomDeviceId } from "./utils";

export function dayOfWeek(): string {
  return ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date().getDay()];
}

function secondsSinceMidnight(): number {
  const n = new Date();
  return n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
}

function authHeaders(auth: AuthState) {
  return {
    accesstoken: auth.accessToken,
    authtype: "ACCESS_TOKEN",
    deviceid: auth.deviceId,
    userid: auth.userId,
  };
}

export async function planTrip(
  client: AxiosInstance,
  params: TripPlannerParams,
  auth?: AuthState | null
): Promise<TripPlannerResponse> {
  const res = await client.get<TripPlannerResponse>(
    `/scheduler_v4/v4/${params.city}/tripplanner`,
    {
    //  headers: authHeaders(auth),
      params: {
        from_lat: params.fromLat,
        from_lon: params.fromLon,
        to_lat: params.toLat,
        to_lon: params.toLon,
        day: params.day ?? dayOfWeek(),
        start_time: params.startTime ?? secondsSinceMidnight(),
        mode: params.mode ?? "TRANSIT",
        station_type: params.stationType ?? "bus",
        ac: params.ac ?? true,
        nonac: params.nonac ?? true,
        num_itineraries: params.numItineraries ?? 25,
        max_walk_distance: params.maxWalkDistance ?? 1000,
        max_taxi_distance: params.maxTaxiDistance ?? 3000,
      },
    }
  );
  return res.data;
}

export async function getPlaceDetails(
  client: AxiosInstance,
  params: PlaceDetailsParams,
  auth?: AuthState | null
): Promise<PlaceDetailsResponse> {
  const res = await client.get<PlaceDetailsResponse>(
    `/scheduler_v4/v5/place/details`,
    {
    //  headers: authHeaders(auth),
      params: {
        placeid: params.placeId,
        searchPartner: params.searchPartner ?? "heremaps",
        meta: JSON.stringify({ deviceId: params.deviceId ?? randomDeviceId(), }),
      },
    }
  );
  return res.data;
}