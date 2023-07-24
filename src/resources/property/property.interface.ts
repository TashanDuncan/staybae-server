import { Document } from 'mongoose';

export default interface Property extends Document {
  city: string;
  country: string;
  region: string;
  lon: number;
  lat: number;
  description: string;
  caption: string;
  rating: number;
  numVotes: number;
  perNightPrice: number;
  totalPrice: number;
  dateFrom: string;
  dateTo: string;
  numRooms: number;
  numBeds: number;
  numToilets: number;
  sharedProperty: boolean;
  heroImg: string;
  images: string[];
}
