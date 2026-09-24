import type { Country } from "../types/country";

export function filterCountries (
countries: Country[],
query: string,
region: string,
 ): Country []{

    const normalizeQuery: string = query
    .trim()
    .toLowerCase(); 

    return countries.filter(
        (country: Country): boolean => {

            const countryName: string = 
            country.names.common.toLowerCase(); 

            const matchesName: boolean = 
            countryName.includes(normalizeQuery); 

            const matchesRegion:  boolean =
            region === "" || country.region === region; 

            return matchesName && matchesRegion

        },
    );
}