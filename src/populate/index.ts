import "dotenv/config";
import "../database/mongoose";
import { AirportModel } from "../models/AirportModel";

const AIRPORTS_DATA_CSV =
  "https://davidmegginson.github.io/ourairports-data/airports.csv";

async function runPopulate() {
  console.log("Fetching airports data from CSV...");
  const response = await fetch(AIRPORTS_DATA_CSV);
  const csvData = await response.text();

  await AirportModel.deleteMany({});

  console.log("Parsing CSV data...");
  const lines = csvData.split("\n");
  const airports: AirportModel[] = [];

  const ID_INDEX = 0;
  const ICAO_INDEX = 1;
  const NAME_INDEX = 3;
  const LATITUDE_INDEX = 4;
  const LONGITUDE_INDEX = 5;
  const ELEVATION_INDEX = 6;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = line
      .split(",")
      .map((value) => value.trim().replace(/^"|"$/g, ""));

    if (
      isNaN(parseFloat(values[LATITUDE_INDEX])) ||
      isNaN(parseFloat(values[LONGITUDE_INDEX]))
    ) {
      continue;
    }

    const airport: AirportModel = {
      externalId: values[ID_INDEX],
      icao: values[ICAO_INDEX],
      name: values[NAME_INDEX],
      latitude: parseFloat(values[LATITUDE_INDEX]),
      longitude: parseFloat(values[LONGITUDE_INDEX]),
      elevation: isNaN(parseInt(values[ELEVATION_INDEX]))
        ? null
        : parseInt(values[ELEVATION_INDEX]),
    };
    airports.push(airport);
  }

  console.log(`Inserting ${airports.length} airports into the database...`);
  await AirportModel.insertMany(airports);
}

runPopulate()
  .catch((error) => {
    console.error("Error populating database:", error);
  })
  .finally(() => {
    console.log("Done populating database");
    process.exit(0);
  });
