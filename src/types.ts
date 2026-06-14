export interface ChaloConfig {
  baseURL?: string;
  source?: string;
  xType?: string;
  cookie?: string;
  userId?: string;
  auth?: AuthState;
}

export interface ChaloPropsResponse {
  chaloTime: {
    timeStamp: number;
  };
}

export interface OtpRequestParams {
  phoneNumber: string;
  countryCode: string;
  templateId?: string;
}

export interface OtpResponse {
  status: boolean;
  refNo: string;
}

export interface LoginParams {
  mobileNumber: string;
  countryCode: string;
  refNo: string;
  otp: string;
  deviceId?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  clientId: string;
  userId: string;
  gender: string;
  emailId: string;
  mobileNumber: string;
  profilePhoto: string;
  countryCode: string;
  yob: number | null;
}

export interface LoginResponse {
  userProfile: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export interface SearchParams {
  city: string;
  query: string;
  day?: string;
  stationType?: string;
  location?: { lon: number; lat: number };
}

export interface RouteResult {
  result_type: "ROUTE";
  route_id: string;
  route_name: string;
  agency_name: string;
  first_stop_name: string;
  last_stop_name: string;
  direction_stop_name: string;
  via: string;
  transport_type: string;
  station_type: string;
  match_ratio: number;
  isFreeRide: boolean;
  mTicketEnabled: boolean;
  routePassEnabled: boolean;
  routeNamingScheme: string;
  spf: string[];
  special_features: string[];
}

export interface StopResult {
  result_type: "STOP";
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  station_type: string;
  match_ratio: number;
}

export interface PlaceResult {
  result_type: "PLACE";
  searchPartner: string;
  [key: string]: unknown;
}

export interface SearchResponse {
  data: {
    routes: RouteResult[];
    stopsAndPlaces: (StopResult | PlaceResult)[];
    trips: unknown[];
  };
}

export interface AuthState {
  accessToken: string;
  deviceId: string;
  userId: string;
}

export interface TripPlannerParams {
  city: string;
  fromLat: number;
  fromLon: number;
  toLat: number;
  toLon: number;
  day?: string;
  startTime?: number;
  mode?: string;
  stationType?: string;
  ac?: boolean;
  nonac?: boolean;
  numItineraries?: number;
  maxWalkDistance?: number;
  maxTaxiDistance?: number;
}

export interface FareTuple {
  amount: number;
  fare_type: string;
}

export interface Fare {
  default_fare: number;
  fare_tuples: FareTuple[];
  leg_index: number[];
}

export interface Leg {
  mode: string;
  from_lat: number;
  from_lon: number;
  to_lat: number;
  to_lon: number;
  start_time: number;
  end_time: number;
  distance: number;
  travel_time: number;
  polyline?: string;
  start_place_name?: string;
  end_place_name?: string;
  route_id?: string;
  frequency?: number;
  isFrequencyLeg?: boolean;
  [key: string]: unknown;
}

export interface Itinerary {
  total_fare: number;
  time_taken: number;
  number_of_transfers: number;
  legs: Leg[];
  fares: Fare[];
  distance: number;
  reliability: number;
  convenience: number;
  weight: number;
  avg_wait_time: number;
  firstEta: number;
  isNearbyItinerary: boolean;
  inCompleteFare: boolean;
  travel_time: number;
}

export interface TripPlannerResponse {
  status: string;
  payload: {
    itineraries: Itinerary[];
    nearbyItineraries: Itinerary[];
  };
}

export interface PlaceDetailsParams {
  placeId: string;
  searchPartner?: string;
  deviceId?: string;
}

export interface PlaceDetailsResponse {
  result: {
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  };
}

export interface RouteDetailsParams {
  city: string;
  routeId: string;
  day?: string;
}

export interface BusStop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  sequence: number;
  [key: string]: unknown;
}

export interface LiveBus {
  trip_id: string;
  vehicle_id?: string;
  lat?: number;
  lon?: number;
  bearing?: number;
  speed?: number;
  [key: string]: unknown;
}

export interface RouteStop {
  stop_id: string;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  stop_address?: string;
  stop_code?: string;
  short_id?: number;
  city?: string;
  station_type?: string;
  transport_type?: string;
  localeMap?: Record<string, unknown>;
}

export interface TripEntry {
  trip_id: string;
  agency_name: string;
  start_time: number;
  end_time: number;
  trip_duration: number;
  isFrequencyTrip: boolean;
  extrapolated: boolean;
  spf: string[];
  special_features: string[];
  type: number;
}

export interface TimeTableEntry {
  start_time: number;
  isFrequency: boolean;
  extrapolated: boolean;
}

export interface RouteDetail {
  route_id: string;
  route_name: string;
  internalName: string;
  short_id: number;
  agency_name: string;
  direction: string;
  station_type: string;
  transport_type: string;
  subCategory: string;
  serviceCategory: string;
  routeNamingScheme: string;
  via: string;
  polyline: string;
  reverse_routeId: string;
  isLive: string;
  isAirportRoute: boolean;
  isFreeRide: boolean;
  isPremiumBusRoute: boolean;
  hasFrequencyTrips: boolean;
  mTicketEnabled: boolean;
  routePassEnabled: boolean;
  stopPassEnabled: boolean;
  shortTripEnabled: boolean;
  ticketingAllowed: boolean;
  totalDistance: number;
  so: number;
  spf: string[];
  localeMap: Record<string, unknown>;
  polyIndicesForStops: unknown[];
  first_stop: RouteStop;
  last_stop: RouteStop;
  direction_stop: RouteStop;
  stopSequenceWithDetails: RouteStop[];
  ttSid: number;
  ttStatus: number;
  tt_type: number;
}

export interface RouteDetailsLiveResponse {
  route: RouteDetail;
  timeTable: TimeTableEntry[];
  timings: TimeTableEntry[];
  trips: TripEntry[];
}

export interface RouteLiveInfoParams {
  city: string;
  routeId: string;
  stopIds: string | string[];
}

export interface BusLiveInfo {
  lSId: string;
  sId?: string;
  psId?: string;
  vNo: string;
  opId?: string;
  bearing?: number;
  eta: number;
  dist?: number;
  _latitude?: number;
  _longitude?: number;
  _isHalted?: boolean;
  isHalted?: boolean;
  psTime?: number;
  tS: number;
  ag?: string;
  dest?: string;
  rN?: string;
}

export interface RouteLiveInfoResponse {
  routeLiveInfo: Record<string, string>;
  stopsEta: Record<string, Record<string, string>>;
}

export interface ParsedRouteLiveInfo {
  routeLiveInfo: Record<string, BusLiveInfo>;
  stopsEta: Record<string, Record<string, BusLiveInfo>>;
}