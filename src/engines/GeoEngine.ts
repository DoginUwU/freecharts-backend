import * as Sentry from "@sentry/node";
import axios, { AxiosInstance } from "axios";
import { singleton } from "tsyringe";
import { AppError } from "../errors";
import { redis } from "../services/extern/redis";
import { AirportModel } from "../models/AirportModel";
import osmtogeojson from "osmtogeojson";

const DEFAULT_CACHE_TTL = 60 * 60 * 24 * 3; // 3d

@singleton()
export class GeoEngine {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
        Accept: "*/*",
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        Sentry.captureException(error, {
          tags: {
            provider: "geoEngine",
          },
        });
        return Promise.reject(error);
      },
    );
  }

  public async loadAirportOSM(icao: string): Promise<unknown> {
    const cacheKey = `geo:airportOSM:${icao.toUpperCase()}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const airport = await AirportModel.findOne({
      icao: icao.toUpperCase(),
    });

    if (!airport) {
      throw new AppError("Airport not found", 404);
    }

    const invalidAirportTypes = ["seaplane_base", "heliport"];
    if (
      airport.airportType &&
      invalidAirportTypes.includes(airport.airportType)
    ) {
      throw new AppError(
        `Airport type "${airport.airportType}" is not supported.`,
        400,
      );
    }

    const data = await airport.populateGeoJSON();
    const geojson = osmtogeojson(data);

    await redis.set(cacheKey, JSON.stringify(geojson), "EX", DEFAULT_CACHE_TTL);

    return geojson;
  }
}
