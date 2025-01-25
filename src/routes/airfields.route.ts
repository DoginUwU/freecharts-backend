import { Router } from "express";
import { AirfieldsController } from "../controllers/airfields.controller";

const airfieldRoutes = Router();
const airfieldsController = new AirfieldsController();

airfieldRoutes.get("/:icao", airfieldsController.findByICAO);
airfieldRoutes.get("/:icao/charts", airfieldsController.findChartsByICAO);
airfieldRoutes.get("/:icao/charts/:chartId", airfieldsController.loadChart);

export { airfieldRoutes };
