import { model, Schema } from "mongoose";

export interface AirportModel {
  externalId: string;
  icao: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number | null;
}

const schema = new Schema<AirportModel>({
  externalId: { type: String, required: true },
  icao: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  elevation: { type: Number, required: false, default: null },
});

schema.index({ latitude: 1, longitude: 1 });
schema.index({ icao: 1 });

export const AirportModel = model<AirportModel>("Airport", schema);
