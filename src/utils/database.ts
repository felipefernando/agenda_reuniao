
import { useState, useEffect } from 'react';

// Database configuration
const DB_CONFIG = {
  host: 'localhost', // Replace with your actual database host
  user: 'root',      // Replace with your actual database username
  password: '',      // Replace with your actual database password
  database: 'portal' // Replace with your actual database name
};

// Interface for birthday data
export interface BirthdayData {
  name: string;      // nm_dsc_usu in DB
  department: string; // nm_dep in DB
  date: string;      // dt_nac in DB format dd-mm
}

/**
 * Fetches birthdays for the current week in the specified location
 * 
 * @param location - The city/location to filter birthdays
 * @param currentDate - The current date to calculate week range
 * @returns Array of birthday data
 */
export async function fetchBirthdaysForWeek(
  location: string, 
  currentDate: Date = new Date()
): Promise<BirthdayData[]> {
  try {
    // Calculate week start and end dates
    const dayOfWeek = currentDate.getDay(); // 0 for Sunday, 6 for Saturday
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - dayOfWeek);
    
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + (6 - dayOfWeek));
    
    // Format dates for query (MM-DD format)
    const weekStart = `${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
    const weekEnd = `${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
    
    // API endpoint
    const response = await fetch('/api/birthdays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        weekStart,
        weekEnd
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch birthdays: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.map((item: any) => ({
      name: item.nm_dsc_usu,
      department: item.nm_dep,
      date: item.dt_nac
    }));
  } catch (error) {
    console.error('Error fetching birthdays:', error);
    return [];
  }
}

/**
 * React hook to fetch birthdays for the current week
 * 
 * @param location - The city/location to filter birthdays
 * @param date - The date to calculate week range from
 * @returns Object with birthdays data, loading state and error
 */
export function useBirthdays(location: string, date: Date = new Date()) {
  const [birthdays, setBirthdays] = useState<BirthdayData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadBirthdays = async () => {
      try {
        setLoading(true);
        const data = await fetchBirthdaysForWeek(location, date);
        setBirthdays(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Failed to load birthdays:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBirthdays();
  }, [location, date]);

  return { birthdays, loading, error };
}
