import axios, { AxiosInstance } from "axios";
import { XMLParser } from "fast-xml-parser";
import { singleton } from "tsyringe";
import { Airfield, Chart, ChartType } from "../../@types/provider";
import {
  AisWebAirfieldChartsXML,
  AisWebAirfieldChartType,
  AisWebAirfieldChartXML,
  AisWebAirfieldXML,
} from "../../@types/providers/aisweb";
import { AppError } from "../../errors";
import { redis } from "../../services/extern/redis";
import { ProviderEngine, SupportedProviderEngines } from "../ProviderEngine";
import { storage } from "../../config";

const parser = new XMLParser({
  ignoreAttributes: false,
});

const DEFAULT_CACHE_TTL = 60 * 60 * 24 * 7; // 7d

@singleton()
export class AisWebEngine extends ProviderEngine {
  private api: AxiosInstance;

  constructor() {
    super();

    this.api = axios.create({
      baseURL: process.env.AISWEB_API_URL,
      params: {
        apiKey: process.env.AISWEB_API_KEY,
        apiPass: process.env.AISWEB_API_PASS,
      },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
        Referer: process.env.AISWEB_API_URL,
        Accept: "*/*",
      },
    });
  }

  public get code(): SupportedProviderEngines {
    return "aisweb";
  }

  public get copyright() {
    return "Decea";
  }

  public async findAirfieldByICAO(icao: string): Promise<Airfield> {
    if (!icao.toUpperCase().startsWith("S") || icao.length !== 4) {
      throw new AppError("Invalid ICAO", 400);
    }

    const redisKey = `airfield:${icao.toUpperCase()}`;
    let data: string;

    if (await redis.exists(redisKey)) {
      data = (await redis.get(redisKey))!;
    } else {
      const response = await this.api.get("/", {
        params: {
          area: "rotaer",
          icaoCode: icao,
        },
      });

      data = response.data;
    }

    const { aisweb }: AisWebAirfieldXML = await parser.parse(data);

    if (!aisweb) throw new AppError("Failed to parse data from provider", 500);

    await redis.set(redisKey, data, "EX", DEFAULT_CACHE_TTL);

    return {
      icao: aisweb.AeroCode,
      city: aisweb.city,
      state: aisweb.uf,
      lat: aisweb.lat,
      lng: aisweb.lng,
      name: aisweb.name,
    };
  }

  public async findChartsByICAO(icao: string): Promise<Chart[]> {
    if (!icao.toUpperCase().startsWith("S") || icao.length !== 4) {
      throw new AppError("Invalid ICAO", 400);
    }

    const redisKey = `airfield:charts:${icao.toUpperCase()}`;
    let data: string;

    if (await redis.exists(redisKey)) {
      data = (await redis.get(redisKey))!;
    } else {
      const response = await this.api.get("/", {
        params: {
          area: "cartas",
          icaoCode: icao,
        },
      });

      data = response.data;
    }

    const { aisweb }: AisWebAirfieldChartsXML = await parser.parse(data);

    if (!aisweb) throw new AppError("Failed to parse data from provider", 500);

    await redis.set(redisKey, data, "EX", DEFAULT_CACHE_TTL);

    return aisweb.cartas.item.map((chart) => ({
      id: this.createChartId(chart.nome, icao),
      name: chart.nome,
      type: this.convertedChartTypes[chart.tipo] ?? chart.tipo,
      subType: this.createChartSubType(chart),
      download: chart.link,
      icao,
    }));
  }

  public async loadChart(
    icao: string,
    chartId: string,
  ): Promise<Buffer<ArrayBufferLike>> {
    if (!icao.toUpperCase().startsWith("S") || icao.length !== 4) {
      throw new AppError("Invalid ICAO", 400);
    }

    const redisKey = `airfield:charts:${icao.toUpperCase()}:${chartId}`;
    const filePath = `charts/${chartId}.pdf`;

    if (await redis.exists(redisKey)) {
      return await storage.read(filePath);
    }

    const charts = await this.findChartsByICAO(icao);
    const foundChart = charts.find((chart) => chart.id === chartId);

    if (!foundChart) {
      throw new AppError(`Chart not found for ${icao}`, 404);
    }

    const { data } = await axios.get<Buffer<ArrayBufferLike>>(
      foundChart.download,
      {
        responseType: "arraybuffer",
      },
    );

    if (!data) {
      throw new AppError("Failed to retrieve pdf", 500);
    }

    await redis.set(redisKey, "FOUNDED", "EX", DEFAULT_CACHE_TTL);

    await storage.upload(filePath, data);

    return data;
  }

  private get convertedChartTypes(): Record<
    AisWebAirfieldChartType,
    ChartType
  > {
    return {
      ADC: "GRD",
      IAC: "APP",
      SID: "SID",
      STAR: "STAR",
      VAC: "VAC",
    };
  }

  private createChartSubType(chart: AisWebAirfieldChartXML) {
    const splitedName = chart.nome.toUpperCase().split(/ /g);
    const rwyIndex = splitedName.indexOf("RWY");

    if (rwyIndex !== -1) {
      const rwyFromChart = splitedName[rwyIndex + 1];

      return `Runway ${rwyFromChart}`;
    }

    if (chart.tipo === "ADC") {
      return "ADC";
    }

    return null;
  }
}
