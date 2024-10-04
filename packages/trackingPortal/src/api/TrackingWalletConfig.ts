import { URLString } from "@shared/primitives";

export class TrackingWalletConfig {
  constructor(public baseUrl: URLString) {
    this.baseUrl = baseUrl;
  }
}
