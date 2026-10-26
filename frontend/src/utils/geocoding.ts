import { useState, useEffect } from 'react';

export type GeocodeLocation = {
  name: string;
  flag: string;
  displayString: string;
  country?: string;
  countryCode?: string;
  region?: string;
};

const geocodeCache = new Map<string, GeocodeLocation | null>();

/**
 * Convert ISO-3166-1 alpha-2 country code to an emoji flag.
 */
export function getCountryFlag(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '📍';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((c) => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '📍';
  }
}

/**
 * Resolve the Google Maps Geocoder instance dynamically.
 */
async function resolveGeocoder(): Promise<google.maps.Geocoder | null> {
  if (typeof window === 'undefined') return null;

  if (window.google?.maps?.Geocoder) {
    return new window.google.maps.Geocoder();
  }

  if (window.google?.maps?.importLibrary) {
    try {
      const lib = (await window.google.maps.importLibrary('geocoding')) as google.maps.GeocodingLibrary;
      if (lib?.Geocoder) {
        return new lib.Geocoder();
      }
    } catch {
      // Ignore and fallback to polling
    }
  }

  // Poll briefly for Google Maps script initialization
  for (let i = 0; i < 5; i++) {
    await new Promise((res) => setTimeout(res, 200));
    if (window.google?.maps?.Geocoder) {
      return new window.google.maps.Geocoder();
    }
  }

  return null;
}

/**
 * Reverse geocode coordinates using pure Google Maps Geocoder API.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeLocation | null> {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) ?? null;
  }

  const geocoder = await resolveGeocoder();
  if (!geocoder) {
    geocodeCache.set(cacheKey, null);
    return null;
  }

  return new Promise((resolve) => {
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      console.warn('[Google Geocoder Response]:', { status, results, coords: { lat, lng } });
      if (status !== 'OK' || !results || results.length === 0) {
        geocodeCache.set(cacheKey, null);
        resolve(null);
        return;
      }

      let countryName: string | undefined;
      let countryCode: string | undefined;
      let regionName: string | undefined;
      let naturalFeatureName: string | undefined;
      let localityName: string | undefined;

      for (const res of results) {
        for (const comp of res.address_components) {
          if (comp.types.includes('country') && !countryName) {
            countryName = comp.long_name;
            countryCode = comp.short_name;
          }
          if (comp.types.includes('administrative_area_level_1') && !regionName) {
            regionName = comp.long_name;
          }
          if (
            (comp.types.includes('natural_feature') ||
              comp.types.includes('colloquial_area') ||
              comp.types.includes('archipelago')) &&
            !naturalFeatureName
          ) {
            naturalFeatureName = comp.long_name;
          }
          if (
            (comp.types.includes('locality') || comp.types.includes('sublocality')) &&
            !localityName
          ) {
            localityName = comp.long_name;
          }
        }
      }

      const flag = getCountryFlag(countryCode);
      const placeDetail = naturalFeatureName || regionName || localityName;

      let cleanName: string;
      if (countryName && placeDetail && placeDetail !== countryName) {
        cleanName = `${placeDetail}, ${countryName}`;
      } else if (countryName) {
        cleanName = countryName;
      } else if (placeDetail) {
        cleanName = placeDetail;
      } else {
        const firstAddr = results[0]?.formatted_address;
        if (firstAddr && !firstAddr.includes('+')) {
          cleanName = firstAddr;
        } else {
          // If only a Plus Code without actual geographic name is returned, treat as no location
          geocodeCache.set(cacheKey, null);
          resolve(null);
          return;
        }
      }

      const locResult: GeocodeLocation = {
        name: cleanName,
        flag,
        displayString: `${flag} ${cleanName}`,
        country: countryName,
        countryCode,
        region: regionName || naturalFeatureName,
      };

      geocodeCache.set(cacheKey, locResult);
      resolve(locResult);
    });
  });
}

/**
 * Custom React hook for fetching reef location from Google Maps Geocoder.
 */
export function useReefLocation(lat?: number, lng?: number) {
  const coordinatesKey = lat !== undefined && lng !== undefined ? `${lat},${lng}` : null;
  const [result, setResult] = useState<{
    coordinatesKey: string | null;
    location: GeocodeLocation | null;
  }>({ coordinatesKey: null, location: null });

  useEffect(() => {
    if (coordinatesKey === null || lat === undefined || lng === undefined) return;

    let isMounted = true;

    reverseGeocode(lat, lng)
      .then((loc) => {
        if (isMounted) {
          setResult({ coordinatesKey, location: loc });
        }
      })
      .catch(() => {
        if (isMounted) {
          setResult({ coordinatesKey, location: null });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [coordinatesKey, lat, lng]);

  const resultIsCurrent = result.coordinatesKey === coordinatesKey;
  return {
    location: resultIsCurrent ? result.location : null,
    loading: coordinatesKey !== null && !resultIsCurrent,
  };
}
