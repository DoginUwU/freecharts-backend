import { Router } from "express";
import { GeoController } from "../controllers/geo.controller";

const geoRoutes = Router();
const geoController = new GeoController();

geoRoutes.get("/airports/:icao", geoController.loadAirportOSM);

export { geoRoutes };
