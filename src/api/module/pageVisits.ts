import Http from '../http';

export interface PageVisit {
  id: number;
  trader_uuid?: string;
  ip_address?: string;
  country?: string;
  country_zh?: string;
  city?: string;
  city_zh?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  path?: string;
  visit_host?: string;
  visit_url?: string;
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
