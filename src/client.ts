import axios, { AxiosInstance } from "axios";
import { ChaloConfig } from "./types";

export function createAxiosInstance(config: ChaloConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL ?? "https://chalo.com/app/api",
    headers: {
      accept: "application/json",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
      "sec-ch-ua": '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "priority": "u=1, i",
      source: config.source ?? "1",
      "x-type": config.xType ?? "pass",
      referer: "https://chalo.com/app/",
      ...(config.cookie ? { cookie: config.cookie } : {}),
    },
  });

  return instance;
}