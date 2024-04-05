import axios from "axios";

export const ReverseGeocodingService ={
  async getAddress(latitude: string, longitude: string) {
    const URL = `https://api.3geonames.org/${latitude},${longitude}`;
    try {
      const response = await axios.get(URL);
      const data = response.data;

      const nearestPlace = data.nearest?.latt ?? 'Not available';
      const cityName = data.adminCode1?.name ?? 'Not available';
    }
  }
}
