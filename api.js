import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://restcountries.com/v3.1',
});

export const fields =
  'name,capital,flags,cca2,population,region,subregion,continents,languages,currencies,timezones';

export const getAllCountries = `/all?fields=${fields}`;
export const getCountryByCode = (code) => `/alpha/${code}?fields=${fields}`;

export function normalizeCountry(item) {
  return {
    code: item?.cca2 ?? item?.cca3 ?? String(Math.random()),
    name: item?.name?.common ?? 'Sem nome',
    officialName: item?.name?.official ?? item?.name?.common ?? 'Sem nome',
    capital: Array.isArray(item?.capital) ? item.capital[0] : item?.capital ?? '—',
    region: item?.region ?? '—',
    subregion: item?.subregion ?? '—',
    continent: Array.isArray(item?.continents) ? item.continents[0] : item?.continents ?? '—',
    population: item?.population ?? null,
    flag: item?.flags?.png ?? item?.flags?.svg ?? null,
    currencies: item?.currencies ? Object.values(item.currencies).map((c) => c.name).join(', ') : '—',
    languages: item?.languages ? Object.values(item.languages).join(', ') : '—',
    timezones: Array.isArray(item?.timezones) ? item.timezones.join(', ') : '—',
  };
}

export function formatPopulation(value) {
  if (!value && value !== 0) return '—';
  return new Intl.NumberFormat('pt-BR').format(value);
}