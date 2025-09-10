/**
 * @fileOverview Utility functions for calculating evapotranspiration
 * 
 * This file implements the Hargreaves-Samani equation for estimating
 * reference evapotranspiration (ET0) based on temperature and solar radiation.
 */

/**
 * Calculate evapotranspiration using the Hargreaves-Samani equation
 * 
 * ET0 = 0.0023 × RA × (Tmax - Tmin)^0.5 × (Tmean + 17.8)
 * 
 * Where:
 * - ET0 = reference evapotranspiration (mm/day)
 * - RA = extraterrestrial radiation (mm/day)
 * - Tmax = maximum temperature (°C)
 * - Tmin = minimum temperature (°C)
 * - Tmean = mean temperature (°C)
 * 
 * @param tempMean Mean temperature in Celsius
 * @param tempMax Maximum temperature in Celsius 
 * @param tempMin Minimum temperature in Celsius
 * @param latitude Latitude in degrees (used to estimate solar radiation if not provided)
 * @param solarRadiation Solar radiation in MJ/m²/day (optional)
 * @param dayOfYear Day of year (1-365)
 * @returns Evapotranspiration in mm/day
 */
export function calculateEvapotranspiration(
    tempMean: number,
    tempMax: number,
    tempMin: number,
    latitude: number,
    dayOfYear: number,
    solarRadiation?: number
): number {
    // Convert luminosity (lux) to solar radiation (MJ/m²/day) if provided
    let extraterrestrialRadiation: number;

    if (solarRadiation) {
        // If solar radiation is provided directly
        extraterrestrialRadiation = solarRadiation;
    } else {
        // Otherwise estimate extraterrestrial radiation based on latitude and day of year
        extraterrestrialRadiation = calculateExtraterrestrialRadiation(latitude, dayOfYear);
    }

    // Hargreaves-Samani equation
    const et0 = 0.0023 * extraterrestrialRadiation *
        Math.sqrt(tempMax - tempMin) *
        (tempMean + 17.8);

    // Return rounded to 2 decimal places
    return Math.round(et0 * 100) / 100;
}

/**
 * Calculate extraterrestrial radiation based on latitude and day of year
 * 
 * @param latitude Latitude in degrees
 * @param dayOfYear Day of year (1-365)
 * @returns Extraterrestrial radiation in MJ/m²/day
 */
function calculateExtraterrestrialRadiation(latitude: number, dayOfYear: number): number {
    // Convert latitude from degrees to radians
    const latRad = latitude * Math.PI / 180;

    // Solar declination (radians)
    const solarDeclination = 0.409 * Math.sin(2 * Math.PI * dayOfYear / 365 - 1.39);

    // Inverse relative distance Earth-Sun
    const dr = 1 + 0.033 * Math.cos(2 * Math.PI * dayOfYear / 365);

    // Sunset hour angle (radians)
    const sunsetHourAngle = Math.acos(-Math.tan(latRad) * Math.tan(solarDeclination));

    // Extraterrestrial radiation (MJ/m²/day)
    const ra = 24 * 60 / Math.PI * 0.082 * dr * (
        sunsetHourAngle * Math.sin(latRad) * Math.sin(solarDeclination) +
        Math.cos(latRad) * Math.cos(solarDeclination) * Math.sin(sunsetHourAngle)
    );

    return ra;
}

/**
 * Get current day of year (1-365)
 * @returns Day of year (1-365)
 */
export function getCurrentDayOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear;
}

/**
 * Convert luminosity in lux to solar radiation in MJ/m²/day (approximate conversion)
 * @param luxValue Luminosity in lux
 * @returns Approximate solar radiation in MJ/m²/day
 */
export function luxToSolarRadiation(luxValue: number): number {
    // Approximate conversion: 1 lux ≈ 0.0079 W/m²
    // And 1 W/m² for 24 hours ≈ 0.0864 MJ/m²/day
    return luxValue * 0.0079 * 0.0864;
}