import axios from 'axios';


export const api = axios.create({
  baseURL: 'https://restcountries.com/v3.1',
});

export const getAllCountries =
  '/all?fields=name,capital,flags,cca2,population,region';

export const getCountryByCode = (code) =>
  `/alpha/${code}`;

export function normalizeCountry(item) {

  return {

    code: item.cca2,

    name: item.name.common,

    officialName: item.name.official,

    capital: item.capital?.[0] || 'Sem capital',

    region: item.region || '---',

    subregion: item.subregion || '---',

    continent: item.continents?.[0] || '---',

    population: item.population || 0,

    flag: item.flags?.png,

    currencies: item.currencies
      ? Object.values(item.currencies)
          .map((c) => c.name)
          .join(', ')
      : '---',

    languages: item.languages
      ? Object.values(item.languages).join(', ')
      : '---',

    timezones: item.timezones?.join(', ') || '---',
  };
  
}
export function formatPopulation(value) {

  if (!value && value !== 0) {
    return '---';
  }

  return new Intl.NumberFormat('pt-BR').format(value);
}