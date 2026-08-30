import type { Event } from './types';

const LUMA_API_BASE = 'https://api.lu.ma/public/v1';

interface LumaEvent {
  api_id: string;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  geo_address_info?: {
    city?: string;
    country?: string;
    full_address?: string;
  };
  url: string;
  cover_url?: string;
}

/**
 * Fetch events from Luma API for Superteam Malaysia
 * Falls back to sample data if API is unavailable
 */
export async function fetchLumaEvents(): Promise<Event[]> {
  try {
    const apiKey = process.env.LUMA_API_KEY;
    if (!apiKey) {
      console.warn('LUMA_API_KEY not set, using sample data');
      return [];
    }

    const response = await fetch(`${LUMA_API_BASE}/calendar/list-events`, {
      headers: {
        'x-luma-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.status}`);
    }

    const data = await response.json();
    const events: LumaEvent[] = data.entries || [];

    return events.map((event) => ({
      id: event.api_id,
      title: event.name,
      description: event.description || '',
      date: event.start_at,
      end_date: event.end_at,
      location: event.geo_address_info?.city
        ? `${event.geo_address_info.city}, ${event.geo_address_info.country || 'Malaysia'}`
        : 'Virtual',
      luma_url: event.url || `https://lu.ma/${event.api_id}`,
      image_url: event.cover_url || '',
      is_upcoming: new Date(event.start_at) > new Date(),
      created_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to fetch Luma events:', error);
    return [];
  }
}
