import { AxiosInstance } from "axios";
import { createAxiosInstance } from "./client";
import { getChaloProps } from "./configuration";
import { requestOtp, login } from "./auth";
import { search } from "./search"
import { planTrip, getPlaceDetails } from "./trip";
import { buildCookie } from "./utils";
import {
  ChaloConfig,
  ChaloPropsResponse,
  OtpRequestParams,
  OtpResponse,
  LoginParams,
  LoginResponse,
  SearchParams,
  SearchResponse,
  AuthState,
  TripPlannerParams,
  TripPlannerResponse,
  PlaceDetailsParams,
  PlaceDetailsResponse,
  RouteDetailsLiveResponse,
  RouteDetailsParams,
  RouteLiveInfoParams,
  ParsedRouteLiveInfo
} from "./types";
import { getRouteDetailsLive, getRouteLiveInfo, listenRouteLiveInfo } from "./routes"
import { RouteLiveTracker } from "./live";

export class ChaloSDK {
  private client: AxiosInstance;
  private config: ChaloConfig;
  private auth: AuthState | null = null;

  constructor(config: ChaloConfig = {}) {
    this.config = {
      cookie: buildCookie(),
      ...config,
    };
    this.auth = config.auth ?? null;
    this.client = createAxiosInstance(this.config);
  }

  async getChaloProps(): Promise<ChaloPropsResponse> {
    return getChaloProps(this.client);
  }

  async requestOtp(params: OtpRequestParams): Promise<OtpResponse> {
    const userId = this.config.userId ?? `+${params.countryCode}-${params.phoneNumber}`;
    return requestOtp(this.client, params, userId);
  }

  async login(params: LoginParams): Promise<LoginResponse> {
    const userId = this.config.userId ?? `+${params.countryCode}-${params.mobileNumber}`;
    const result = await login(this.client, params, userId);
    this.auth = {
      accessToken: result.accessToken,
      deviceId: params.deviceId ?? result.userProfile.userId,
      userId: result.userProfile.userId,
    };
    return result;
  }

  async search(params: SearchParams): Promise<SearchResponse> {
    return search(this.client, params);
  }

  async planTrip(params: TripPlannerParams): Promise<TripPlannerResponse> {
   // if (!this.auth) throw new Error("Not authenticated — call login() first");
    return planTrip(this.client, params, this.auth);
  }

  async getPlaceDetails(params: PlaceDetailsParams): Promise<PlaceDetailsResponse> {
   // if (!this.auth) throw new Error("Not authenticated — call login() first");
    return getPlaceDetails(this.client, params, this.auth);
  }

  getCookie(): string {
    return this.config.cookie!;
  }

  async getRouteDetailsLive(params: RouteDetailsParams): Promise<RouteDetailsLiveResponse> {
    return getRouteDetailsLive(this.client, params);
  }

  async getRouteLiveInfo(params: RouteLiveInfoParams): Promise<ParsedRouteLiveInfo> {
    return getRouteLiveInfo(this.client, params);
  }

  listenRouteLiveInfo(
    params: RouteLiveInfoParams,
    callback: (data: ParsedRouteLiveInfo) => void,
    intervalSeconds: number = 10
  ): () => void {
    return listenRouteLiveInfo(this.client, params, callback, intervalSeconds);
  }

  trackRouteLive(
    params: RouteLiveInfoParams,
    intervalSeconds: number = 10
  ): RouteLiveTracker {
    return new RouteLiveTracker(this.client, params, intervalSeconds);
  }

}

export * from "./types";
export { buildCookie } from "./utils";
export { RouteLiveTracker } from "./live";