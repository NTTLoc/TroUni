/**
 * Alternative Map API Services
 * Backup services và Goong Maps integration
 */

import { goongApi } from '../services/goongApi';

/**
 * Sử dụng Goong Maps API (chính)
 */
export const searchWithGoong = async (query) => {
  try {
    const results = await goongApi.searchPlacesWithDetail(query, { limit: 5 });
    
    return results.map((item) => ({
      id: item.id,
      display_name: item.display_name,
      lat: item.lat,
      lng: item.lng,
      address: {
        city: item.address.city || "",
        district: item.address.district || "",
        ward: item.address.ward || "",
        country: item.address.country || "",
      },
    }));
  } catch (err) {
    console.error("Goong API error:", err);
    throw err;
  }
};

/**
 * Sử dụng Google Places API (miễn phí với quota)
 */
export const searchWithGooglePlaces = async (query) => {
  try {
    // Sử dụng Google Places Text Search API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        query
      )}&key=YOUR_API_KEY&region=vn&language=vi`
    );

    if (!response.ok) throw new Error("Google API error");

    const data = await response.json();

    return data.results.map((place) => ({
      id: place.place_id,
      display_name: place.formatted_address,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      address: {
        city:
          place.address_components?.find((c) => c.types.includes("locality"))
            ?.long_name || "",
        district:
          place.address_components?.find((c) =>
            c.types.includes("administrative_area_level_2")
          )?.long_name || "",
        country:
          place.address_components?.find((c) => c.types.includes("country"))
            ?.long_name || "",
      },
    }));
  } catch (err) {
    console.error("Google Places API error:", err);
    throw err;
  }
};

/**
 * Sử dụng MapBox Geocoding API
 */
export const searchWithMapBox = async (query) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=YOUR_MAPBOX_TOKEN&country=VN&language=vi&limit=5`
    );

    if (!response.ok) throw new Error("MapBox API error");

    const data = await response.json();

    return data.features.map((feature) => ({
      id: feature.id,
      display_name: feature.place_name,
      lat: feature.center[1],
      lng: feature.center[0],
      address: {
        city:
          feature.context?.find((c) => c.id.startsWith("place"))?.text || "",
        district:
          feature.context?.find((c) => c.id.startsWith("district"))?.text || "",
        country:
          feature.context?.find((c) => c.id.startsWith("country"))?.text || "",
      },
    }));
  } catch (err) {
    console.error("MapBox API error:", err);
    throw err;
  }
};

/**
 * Sử dụng HERE Geocoding API
 */
export const searchWithHERE = async (query) => {
  try {
    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        query
      )}&apikey=YOUR_HERE_API_KEY&in=countryCode:VN&limit=5&lang=vi`
    );

    if (!response.ok) throw new Error("HERE API error");

    const data = await response.json();

    return data.items.map((item) => ({
      id: item.id,
      display_name: item.title,
      lat: item.position.lat,
      lng: item.position.lng,
      address: {
        city: item.address.city || "",
        district: item.address.district || "",
        country: item.address.countryName || "",
      },
    }));
  } catch (err) {
    console.error("HERE API error:", err);
    throw err;
  }
};

/**
 * Smart search với Goong Maps API và fallback methods
 */
export const smartSearch = async (query) => {
  const searchMethods = [
    // Thử Goong Maps API trước
    async () => {
      const results = await goongApi.searchPlacesWithDetail(query, { limit: 5 });
      return results.map((item) => ({
        id: item.id,
        display_name: item.display_name,
        lat: item.lat,
        lng: item.lng,
        address: item.address || {},
      }));
    },

    // Fallback với mock data
    async () => {
      const { getFallbackSuggestions } = await import("./mapFallback");
      return getFallbackSuggestions(query);
    },
  ];

  for (const method of searchMethods) {
    try {
      const results = await method();
      if (results && results.length > 0) {
        return results;
      }
    } catch (err) {
      console.warn("Search method failed:", err);
      continue;
    }
  }

  throw new Error("All search methods failed");
};
