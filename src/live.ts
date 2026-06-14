import { EventEmitter } from "events";
import { AxiosInstance } from "axios";
import { RouteLiveInfoParams, ParsedRouteLiveInfo } from "./types";
import { getRouteLiveInfo } from "./routes";

export class RouteLiveTracker extends EventEmitter {
  private client: AxiosInstance;
  private params: RouteLiveInfoParams;
  private intervalSeconds: number;
  private active: boolean = false;
  private timer: NodeJS.Timeout | null = null;

  constructor(
    client: AxiosInstance,
    params: RouteLiveInfoParams,
    intervalSeconds: number = 10
  ) {
    super();
    this.client = client;
    this.params = params;
    this.intervalSeconds = intervalSeconds;
  }

  start(): this {
    if (this.active) return this;
    this.active = true;
    this.emit("start");
    this.poll();
    return this;
  }

  stop(): this {
    if (!this.active) return this;
    this.active = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.emit("stop");
    return this;
  }

  private async poll(): Promise<void> {
    if (!this.active) return;
    try {
      const data = await getRouteLiveInfo(this.client, this.params);
      if (this.active) this.emit("data", data);
    } catch (e) {
      if (this.active) this.emit("error", e);
    }
    if (this.active) {
      this.timer = setTimeout(() => this.poll(), this.intervalSeconds * 1000);
    }
  }
}