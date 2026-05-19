export type UpcomingConcert = {
  id: string;
  name: string;
  artist: string;
  venue: string;
  city: string;
  state: string;
  date: string;
  time: string | null;
  url: string | null;
  imageUrl: string | null;
};
