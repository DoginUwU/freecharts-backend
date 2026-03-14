import axios, { AxiosError } from "axios";
import { OverpassIntercepterData } from "../../@types/geo.types";
import { container, singleton } from "tsyringe";

const MIRRORS = [
  "https://overpass-api.de/api/",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

@singleton()
class OverpassService {
  async fetchInterpreter(query: string): Promise<OverpassIntercepterData> {
    let mirrorIndex = 0;
    const mirrorCount = MIRRORS.length;

    while (mirrorIndex < mirrorCount) {
      const mirrorUrl = MIRRORS[mirrorIndex];
      try {
        const { data } = await axios.get<OverpassIntercepterData>(
          mirrorUrl + "interpreter",
          {
            params: { data: query },
            headers: {
              "User-Agent": "FreeCharts-EFB-App/1.0",
            },
            timeout: 30000,
          },
        );
        return data;
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(`Error fetching from ${mirrorUrl}:`, error.message);
        } else {
          console.error(`Unexpected error fetching from ${mirrorUrl}:`, error);
        }
        mirrorIndex++;
      }
    }

    throw new Error("All Overpass mirrors failed");
  }
}

export const overpassService = container.resolve(OverpassService);
