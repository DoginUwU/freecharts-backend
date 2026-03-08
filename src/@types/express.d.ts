import { GeoEngine } from "../engines/GeoEngine";
import { ProviderEngine } from "../engines/ProviderEngine";

export {};

declare global {
  namespace Express {
    export interface Request {
      provider: ProviderEngine;
      geoEngine: GeoEngine;
    }
  }
}
