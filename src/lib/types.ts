export interface SearchParams {
  q?: string;
  [key: string]: string | string[] | undefined;
}

export interface BandsInTownEvent {
  id: string;
  artist_id: string;
  url: string;
  on_sale_datetime: string;
  datetime: string;
  description: string;
  venue: {
    name: string;
    latitude: string;
    longitude: string;
    city: string;
    region: string;
    country: string;
  };
  offers: Array<{
    type: string;
    url: string;
    status: string;
  }>;
  lineup: string[];
  title?: string;
  image_url?: string;
}

export interface EventDisplay {
  id: string;
  title: string;
  date: string;
  venue: string;
  location: string;
  ticketUrl: string;
  imageUrl: string;
  artist: string;
}