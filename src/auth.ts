import { AxiosInstance } from "axios";
import { OtpRequestParams, OtpResponse, LoginParams, LoginResponse } from "./types";
import { randomDeviceId } from "./utils";

export async function requestOtp(
  client: AxiosInstance,
  params: OtpRequestParams,
  userId: string
): Promise<OtpResponse> {
  const res = await client.post<OtpResponse>(
    "/chaukidar/v1/otp",
    {
      phoneNumber: params.phoneNumber,
      countryCode: params.countryCode,
      templateId: params.templateId ?? "1f9mk",
    },
    {
      headers: {
        "content-type": "application/json",
        userid: userId,
      },
    }
  );
  return res.data;
}

export async function login(
  client: AxiosInstance,
  params: LoginParams,
  userId: string
): Promise<LoginResponse> {
  const res = await client.post<LoginResponse>(
    "/chaukidar/v1/app/login",
    {
      mobileNumber: params.mobileNumber,
      AuthType: "SMS",
      countryCode: params.countryCode,
      refNo: params.refNo,
      deviceId: params.deviceId ?? randomDeviceId(),
      otp: params.otp,
    },
    {
      headers: {
        "content-type": "application/json",
        userid: userId,
      },
    }
  );
  return res.data;
}