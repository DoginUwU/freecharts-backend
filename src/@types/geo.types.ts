export interface OverpassIntercepterData {
  version: number;
  generator: string;
  osm3s: Osm3s;
  elements: Element[];
}

interface Osm3s {
  timestamp_osm_base: string;
  copyright: string;
}

interface Element {
  type: string;
  id: number;
  bounds: Bounds;
  nodes?: number[];
  geometry?: Geometry[];
  tags: Tags;
  members?: Member[];
}

interface Bounds {
  minlat: number;
  minlon: number;
  maxlat: number;
  maxlon: number;
}

interface Geometry {
  lat: number;
  lon: number;
}

interface Tags {
  aeroway: string;
  length?: string;
  ref?: string;
  surface?: string;
  "aerodrome:type"?: string;
  alt_name?: string;
  iata?: string;
  icao?: string;
  name?: string;
  "name:en"?: string;
  operator?: string;
  "operator:type"?: string;
  "operator:wikidata"?: string;
  wikipedia?: string;
  air_conditioning?: string;
  baby_feeding?: string;
  building?: string;
  "building:levels"?: string;
  layer?: string;
  "name:fr"?: string;
  official_name?: string;
  smoking?: string;
  website?: string;
  wheelchair?: string;
  ele?: string;
  maxweight?: string;
  access?: string;
  bridge?: string;
  highway?: string;
  level?: string;
  lit?: string;
  type?: string;
}

interface Member {
  type: string;
  ref: number;
  role: string;
  geometry: Geometry2[];
}

interface Geometry2 {
  lat: number;
  lon: number;
}
