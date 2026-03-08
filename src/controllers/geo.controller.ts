import { Request, Response } from "express";
import { z } from "zod";

const loadAirportOSMSchema = z.object({
  icao: z.string().min(4),
});

export class GeoController {
  public async loadAirportOSM(req: Request, res: Response) {
    const { icao } = loadAirportOSMSchema.parse(req.params);

    const airfieldData = await req.geoEngine.loadAirportOSM(icao);
    res.json(airfieldData);
  }
}
