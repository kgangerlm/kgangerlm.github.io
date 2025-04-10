import { TripData, DayData } from '../types';
import fs from 'fs';
import path from 'path';

/**
 * Fetches the trip overview data
 */
export async function getTripData(): Promise<TripData> {
  const filePath = path.join(process.cwd(), 'public/data/trip-overview.json');
  const data = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(data) as TripData;
}

/**
 * Fetches data for a specific day
 */
export async function getDayData(dayNumber: number): Promise<DayData | null> {
  try {
    const filePath = path.join(process.cwd(), `public/data/day${dayNumber}.json`);
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data) as DayData;
  } catch (error) {
    console.error(`Error loading day ${dayNumber} data:`, error);
    return null;
  }
}

/**
 * Fetches data for all available days
 */
export async function getAllDaysData(totalDays: number): Promise<DayData[]> {
  const daysPromises = [];
  
  for (let i = 1; i <= totalDays; i++) {
    daysPromises.push(getDayData(i));
  }
  
  const daysResults = await Promise.all(daysPromises);
  // Filter out null values (days that weren't found or failed to load)
  return daysResults.filter((day): day is DayData => day !== null);
}

/**
 * Gets all the day IDs for use with dynamic routes
 */
export async function getAllDayIds(totalDays: number): Promise<string[]> {
  const days = await getAllDaysData(totalDays);
  return days.map(day => day.id);
}

/**
 * Gets a specific day by its ID
 */
export async function getDayById(id: string, totalDays: number): Promise<DayData | null> {
  const days = await getAllDaysData(totalDays);
  return days.find(day => day.id === id) || null;
}
