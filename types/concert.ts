export type ConcertRow = {
  id: string;
  user_id: string;
  concert_name: string;
  artist: string;
  venue: string;
  city: string;
  state: string;
  concert_date: string;
  distance_from_home: number;
  hours_at_event: number;
  ticket_cost: number;
  ticket_fees: number;
  parking_cost: number;
  food_drink_cost: number;
  merchandise_cost: number;
  lodging_cost: number;
  travel_cost: number;
  other_cost: number;
  fun_rating: number;
  notes: string | null;
  created_at: string;
};

export type ConcertFormData = {
  concert_name: string;
  artist: string;
  venue: string;
  city: string;
  state: string;
  concert_date: string;
  distance_from_home: string;
  hours_at_event: string;
  ticket_cost: string;
  ticket_fees: string;
  parking_cost: string;
  food_drink_cost: string;
  merchandise_cost: string;
  lodging_cost: string;
  travel_cost: string;
  other_cost: string;
  fun_rating: string;
  notes: string;
};

export const emptyConcertForm: ConcertFormData = {
  concert_name: "",
  artist: "",
  venue: "",
  city: "",
  state: "",
  concert_date: "",
  distance_from_home: "0",
  hours_at_event: "3",
  ticket_cost: "0",
  ticket_fees: "0",
  parking_cost: "0",
  food_drink_cost: "0",
  merchandise_cost: "0",
  lodging_cost: "0",
  travel_cost: "0",
  other_cost: "0",
  fun_rating: "7",
  notes: "",
};
