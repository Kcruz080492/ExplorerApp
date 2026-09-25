import type { Country } from "./country";
export interface CountryDetail extends Country {
  names: Country["names"] & {
    native?: Record<
      string,
      {
        common?: string;
        official?: string;
      }
    >;
  };

  subregion?: string;
  tlds?: string[];

  currencies?: { 
    code: string;
    name: string;
    symbol?: string;
  }[];

  languages?: {
    name: string;
    native_name?: string;
  }[];

  borders?: string[];
}

