import { Airfield, Chart } from "../@types/provider";

export type SupportedProviderEngines = "aisweb";

export abstract class ProviderEngine {
  public abstract get code(): SupportedProviderEngines;
  public abstract get copyright(): string;

  public abstract findAirfieldByICAO(icao: string): Promise<Airfield>;
  public abstract findChartsByICAO(icao: string): Promise<Chart[]>;
  public abstract loadChart(
    icao: string,
    chartId: string,
  ): Promise<Buffer<ArrayBufferLike>>;

  protected createChartId(name: string, icao: string): string {
    return (
      name
        .trim()
        .toLocaleLowerCase()
        .replaceAll(/ /g, "-")
        .replaceAll(/[^\w\s]/gi, "") + icao
    );
  }
}
