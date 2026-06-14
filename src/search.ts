import { AxiosInstance } from "axios";
import { SearchParams, SearchResponse } from "./types";

function todayDDMMYYYY(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

export async function search(
  client: AxiosInstance,
  params: SearchParams
): Promise<SearchResponse> {
  const res = await client.get<SearchResponse>(
    `/scheduler_v4/v5/${params.city}/search`,
    {
      params: {
        day: params.day ?? todayDDMMYYYY(),
        station_type: params.stationType ?? "transit",
        ...(params.location
          ? { location: JSON.stringify(params.location) }
          : {}),
        str: params.query,
      },
    }
  );
  return res.data;
}