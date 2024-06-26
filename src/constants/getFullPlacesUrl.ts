import { VITE_PLACES_API_KEY, VITE_PLACES_API_URL } from '.';

export const getFullPlacesUrl = (radius: string, lat: number | null, lon: number | null, kinds: string): string => {
  const url = `${VITE_PLACES_API_URL}radius=${radius}&lon=${lon}&lat=${lat}&src_geom=osm&src_attr=osm${
    kinds ? `&kinds=${kinds}` : ''
  }&format=json&apikey=${VITE_PLACES_API_KEY}`;

  return url;
};
