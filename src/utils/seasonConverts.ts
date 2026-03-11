export const Seasons = {
    winter: 'Invierno',
    spring: 'Primavera',
    summer: 'Verano',
    fall: 'Otoño'
};

export function getSeasonName(season: string) {
    return Seasons[season as keyof typeof Seasons] || '';
}
