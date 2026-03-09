import { model, Schema } from "mongoose";
import moment from "moment";
import { overpassService } from "../services/extern/overpass";
import { OverpassIntercepterData } from "../@types/geo.types";

const REFRESH_GEOJSON_INTERVAL = 60 * 60 * 24 * 60; // 60d
const AIRPORT_TYPE = [
  "large_airport",
  "medium_airport",
  "small_airport",
  "heliport",
  "seaplane_base",
  "closed",
];

export type AirportType = (typeof AIRPORT_TYPE)[number];

export interface AirportModel {
  externalId: string;
  icao: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number | null;
  geojson: string | null;
  geojsonUpdateDate?: Date;
  airportType?: AirportType;
}

interface AirportModelMethods {
  populateGeoJSON: () => Promise<OverpassIntercepterData>;
}

const schema = new Schema<AirportModel & AirportModelMethods>({
  externalId: { type: String, required: true },
  icao: { type: String, required: true },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  elevation: { type: Number, required: false, default: null },
  geojson: { type: String, required: false, default: null },
  geojsonUpdateDate: { type: Date, required: false },
  airportType: { type: String, required: false, enum: AIRPORT_TYPE },
});

schema.method("populateGeoJSON", async function () {
  const needsUpdate =
    !this.geojsonUpdateDate ||
    moment().diff(this.geojsonUpdateDate, "seconds") > REFRESH_GEOJSON_INTERVAL;

  if (this.geojson && !needsUpdate) {
    return JSON.parse(this.geojson);
  }

  try {
    const query = `
      [out:json];
      (
        way["aeroway"](around:5000, ${this.latitude}, ${this.longitude});
        relation["aeroway"](around:5000, ${this.latitude}, ${this.longitude});
      );
      out geom;
    `;

    const data = await overpassService.fetchInterpreter(query);

    const geojson = JSON.stringify(data);

    this.geojson = geojson;
    this.geojsonUpdateDate = new Date();
    await this.save();

    return data;
  } catch (error) {
    if (this.geojson) {
      console.warn(
        `Failed to update GeoJSON for airport ${this.icao}, returning existing data. Error:`,
        error,
      );
      return JSON.parse(this.geojson);
    }

    console.error(
      `Failed to fetch GeoJSON for airport ${this.icao} and no existing data available. Error:`,
      error,
    );
    throw error;
  }
});

schema.index({ latitude: 1, longitude: 1 });
schema.index({ icao: 1 }, { unique: true });

export const AirportModel = model<AirportModel & AirportModelMethods>(
  "Airport",
  schema,
);
