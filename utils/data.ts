import { TripData, DayData } from '../types';
import { cache } from 'react';
import path from 'path';
import fs from 'fs';

/**
 * Fetches the trip overview data with caching
 */
export const getTripData = cache(async (): Promise<TripData> => {
  try {
    const filePath = path.join(process.cwd(), 'public/data/trip-overview.json');
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data) as TripData;
  } catch (error) {
    console.error('Error loading trip data:', error);
    throw new Error('Failed to load trip data');
  }
});

/**
 * Fetches data for a specific day with caching
 */
export const getDayData = cache(async (dayNumber: number): Promise<DayData | null> => {
  try {
    const filePath = path.join(process.cwd(), `public/data/day${dayNumber}.json`);
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data) as DayData;
  } catch (error) {
    console.error(`Error loading day ${dayNumber} data:`, error);
    return null;
  }
});

/**
 * Fetches data for all available days with caching
 */
export const getAllDaysData = cache(async (totalDays: number): Promise<DayData[]> => {
  const daysPromises = [];
  
  for (let i = 1; i <= totalDays; i++) {
    daysPromises.push(getDayData(i));
  }
  
  const daysResults = await Promise.all(daysPromises);
  // Filter out null values (days that weren't found or failed to load)
  return daysResults.filter((day): day is DayData => day !== null);
});

/**
 * Gets all the day IDs for use with dynamic routes
 */
export const getAllDayIds = cache(async (totalDays: number): Promise<string[]> => {
  const days = await getAllDaysData(totalDays);
  return days.map(day => day.id);
});

/**
 * Gets a specific day by its ID with caching
 */
export const getDayById = cache(async (id: string, totalDays: number): Promise<DayData | null> => {
  const days = await getAllDaysData(totalDays);
  return days.find(day => day.id === id) || null;
});
