export const ReverseGeocodingService = {
  async getAddress(latitude: number, longitude: number) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();

      if (data && data.address) {
        const { house_number, road, city } = data.address;
        return `${road} ${house_number}, ${city}`;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error reverse geocoding coordinates:', error);
      return null;
    }
  },
};
