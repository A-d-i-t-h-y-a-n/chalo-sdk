
import { AxiosInstance } from "axios";
import {
  RouteLiveInfoParams,
  RouteLiveInfoResponse,
  ParsedRouteLiveInfo,
  RouteDetailsParams,
  RouteDetailsLiveResponse
} from "./types";
import { dayOfWeek } from "./trip"

export async function getRouteDetailsLive(
  client: AxiosInstance,
  params: RouteDetailsParams
): Promise<RouteDetailsLiveResponse> {
  const res = await client.get<RouteDetailsLiveResponse>(
    `/scheduler_v4/v4/${params.city}/routedetailslive`,
    {
      params: {
        route_id: params.routeId,
        day: params.day ?? dayOfWeek(),
      },
    }
  );
  return res.data;
}


function parseRouteLiveInfo(raw: RouteLiveInfoResponse): ParsedRouteLiveInfo {
  const routeLiveInfo = Object.fromEntries(
    Object.entries(raw.routeLiveInfo).map(([k, v]) => [k, JSON.parse(v)])
  );
  const stopsEta = Object.fromEntries(
    Object.entries(raw.stopsEta).map(([stopId, buses]) => [
      stopId,
      Object.fromEntries(Object.entries(buses).map(([k, v]) => [k, JSON.parse(v)])),
    ])
  );
  return { routeLiveInfo, stopsEta };
}

export async function getRouteLiveInfo(
  client: AxiosInstance,
  params: RouteLiveInfoParams
): Promise<ParsedRouteLiveInfo> {
  const res = await client.get<RouteLiveInfoResponse>(
    `/vasudha/track/route-live-info/${params.city}/${params.routeId}`,
    { params: { stopIds: Array.isArray(params.stopIds) ? params.stopIds.join(",") : params.stopIds } }
  );
  return parseRouteLiveInfo(res.data);
}

export function listenRouteLiveInfo(
  client: AxiosInstance,
  params: RouteLiveInfoParams,
  callback: (data: ParsedRouteLiveInfo) => void,
  intervalSeconds: number = 10
): () => void {
  let active = true;

  async function poll() {
    while (active) {
      try {
        const data = await getRouteLiveInfo(client, params);
        callback(data);
      } catch (e) {
        console.error("listenRouteLiveInfo error:", e);
      }
      await new Promise((r) => setTimeout(r, intervalSeconds * 1000));
    }
  }

  poll();
  return () => { active = false; };
}