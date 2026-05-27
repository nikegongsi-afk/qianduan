import Http from '../http';

export interface PageVisit {
  id: number;
  trader_uuid?: string;
  ip_address?: string;
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  path?: string;
  user_agent?: string;
  visited_at?: string;
}

export interface VisitMapCity {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  count: number;
  lastVisitedAt?: string;
}

export interface VisitMapSummary {
  totalVisits: number;
  uniqueIps: number;
  uniqueCountries: number;
  cities: VisitMapCity[];
  recent: PageVisit[];
}

export const getVisitMapSummary = (days = 7) =>
  Http.get('/page-visits/summary', { days });

export const getPageVisits = (params: {
  offset?: number;
  limit?: number;
  days?: number;
  search?: string;
}) => Http.get('/page-visits', params);
