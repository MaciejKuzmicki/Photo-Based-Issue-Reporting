export class DateFormatting {
    static formatDateTime(date) {
        const createdAt = new Date(date);
        const year = createdAt.getFullYear();
        const month = String(createdAt.getMonth() + 1).padStart(2, '0');
        const day = String(createdAt.getDate()).padStart(2, '0');
        const hours = String(createdAt.getHours()).padStart(2, '0');
        const minutes = String(createdAt.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}
