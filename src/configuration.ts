import { AxiosInstance } from "axios";
import { ChaloPropsResponse } from "./types";

export async function getChaloProps(client: AxiosInstance): Promise<ChaloPropsResponse> {
  const res = await client.get<ChaloPropsResponse>("/configuration/chalo-props/v1");
  return res.data;
}