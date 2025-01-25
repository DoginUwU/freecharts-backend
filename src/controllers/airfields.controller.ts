import { Request, Response } from "express";
import { z } from "zod";

const findByICAOParamsSchema = z.object({
  icao: z.string().min(4),
});

const loadChartParamsSchema = z.object({
  icao: z.string().min(4),
  chartId: z.string().min(3),
});

export class AirfieldsController {
  public async findByICAO(req: Request, res: Response) {
    const { icao } = findByICAOParamsSchema.parse(req.params);

    const airfieldData = await req.provider.findAirfieldByICAO(icao);
    res.json(airfieldData);
  }

  public async findChartsByICAO(req: Request, res: Response) {
    const { icao } = findByICAOParamsSchema.parse(req.params);

    const charts = await req.provider.findChartsByICAO(icao);
    res.json(charts.map((chart) => ({ ...chart, download: undefined })));
  }

  public async loadChart(req: Request, res: Response) {
    const { icao, chartId } = loadChartParamsSchema.parse(req.params);

    const buffer = await req.provider.loadChart(icao, chartId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="file.pdf"`);
    res.setHeader("Content-Length", buffer.byteLength);

    res.send(Buffer.from(buffer));
  }
}
