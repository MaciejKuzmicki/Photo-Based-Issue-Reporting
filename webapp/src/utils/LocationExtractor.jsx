export class LocationExtractor {
    static extractLocationDetails(entity) {
        const regex = /query=([-+]?\d{1,2}\.\d+),([-+]?\d{1,3}\.\d+)/;
        const match = entity.location.match(regex);
        return {
            lat: match ? parseFloat(match[1]) : null,
            lng: match ? parseFloat(match[2]) : null,
            locationName: entity.locationName,
            imageUrl: entity.imageUrl,
            fixed: entity.isFixed
        };
    }
}