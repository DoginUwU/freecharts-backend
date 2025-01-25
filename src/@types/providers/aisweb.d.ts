export interface AisWebAirfieldXML {
  aisweb: {
    status: "Active";
    dt: string;
    AeroCode: string;
    ciad: string;
    name: string;
    city: string;
    uf: string;
    lat: number;
    lng: number;
    latRotaer: string;
    lngRotaer: string;
    typeOpr: string;
    altFt: string;
  };
}

export interface AisWebAirfieldChartsXML {
  aisweb: {
    cartas: {
      item: AisWebAirfieldChartXML[];
    };
  };
}

export interface AisWebAirfieldChartXML {
  id: string;
  especie: "Convencionais";
  tipo: AisWebAirfieldChartType;
  tipo_descr: Record<string, string>;
  nome: string;
  IcaoCode: string;
  dt: Date;
  link: string;
  arquivo: string;
  kmz: string;
  aviso: string;
  icp: string;
  pe: string;
  notam: string;
  tabcode: string;
  suplementos: { _count: string };
  dtPublic: Date;
  amdt: string;
  use: Record<string, string>;
  _id: string;
}

export type AisWebAirfieldChartType = "IAC" | "SID" | "STAR" | "ADC" | "VAC";
