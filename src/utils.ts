import { randomBytes } from "crypto";

function randomHex(bytes: number): string {
  return randomBytes(bytes).toString("hex");
}

function randomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export function randomDeviceId(): string {
  return randomHex(16);
}

export function buildCookie(options: {
  timeZone?: string;
  distinctId?: string;
  deviceId?: string;
} = {}): string {
  const distinctId = options.distinctId ?? randomHex(16);
  const deviceId = options.deviceId ?? `${randomHex(4)}-${randomHex(2)}-${randomHex(2)}-${randomHex(2)}-${randomHex(6)}`;
  const gaClientId = `${randomDigits(10)}.${Date.now()}`;
  const now = Date.now();
  const gaSession = `GS2.1.s${now}$o1$g1$t${now}$j60$l0$h0`;

  const mixpanel = {
    distinct_id: distinctId,
    $device_id: deviceId,
    $initial_referrer: "$direct",
    $initial_referring_domain: "$direct",
    __mps: {},
    __mpso: {},
    __mpus: {},
    __mpa: {},
    __mpu: {},
    __mpr: [],
    __mpap: [],
    $user_id: distinctId,
    clientSource: "PWA",
    appVersionCode: "1001",
    "selected language": "English",
    timeZone: options.timeZone ?? "+05:30",
    deviceId: distinctId,
  };

  return [
    `_ga=GA1.1.${gaClientId}`,
    `mp_b1925cf6c0b3db7d5f3904a66abf8ec7_mixpanel=${encodeURIComponent(JSON.stringify(mixpanel))}`,
    `_ga_SEWPQ4G3XZ=${gaSession}`,
  ].join("; ");
}