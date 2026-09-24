//src/types/country.ts
export interface CountryNames {
  common: string;
}

export interface CountryCodes {
  alpha_2: string;
}

export interface CountryFlag {
  url_svg: string;
  
  description: string;
}

export interface CountryCapital {
  name: string;
}

export interface Country {
  names: CountryNames;
  codes: CountryCodes;
  flag: CountryFlag;
  population: number;
  region: string;
  capitals: CountryCapital[];
}

export interface CountriesMeta {
  total: number;
  count: number;
  limit: number;
  offset: number;
  more: boolean;
}

export interface CountriesData {
  objects: Country[];
  meta: CountriesMeta;
}

export interface CountriesResponse {
  data: {
    objects: Country[];
    meta: CountriesMeta;
  }
}