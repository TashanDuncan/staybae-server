import { Schema, model } from 'mongoose';
import Property from './property.interface';

const PropertySchema = new Schema(
  {
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    lon: {
      type: Number,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    heroImg: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    numVotes: {
      type: Number,
      required: true,
    },
    perNightPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    dateFrom: {
      type: String,
      required: true,
    },
    dateTo: {
      type: String,
      required: true,
    },
    numRooms: {
      type: Number,
      required: true,
    },
    numBeds: {
      type: Number,
      required: true,
    },
    numToilets: {
      type: Number,
      required: true,
    },
    sharedProperty: {
      type: Boolean,
      required: true,
      default: false,
    },
    images: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default model<Property>('Property', PropertySchema);
