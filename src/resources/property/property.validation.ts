import Joi from 'joi';

const propertyStructure = {
  city: Joi.string().required(),
  country: Joi.string().required(),
  region: Joi.string().required(),
  lon: Joi.number().required(),
  lat: Joi.number().required(),
  description: Joi.string().required(),
  caption: Joi.string().required(),
  rating: Joi.number().required(),
  heroImg: Joi.string().required(),
  numVotes: Joi.number(),
  perNightPrice: Joi.number().required(),
  totalPrice: Joi.number().required(),
  dateFrom: Joi.date().required(),
  dateTo: Joi.date().required(),
  numToilets: Joi.number(),
  numBeds: Joi.number(),
  numRooms: Joi.number(),
  sharedProperty: Joi.boolean(),
  images: Joi.array().items(Joi.string()).empty(Joi.array().length(0)),
};

const create = [
  Joi.object(propertyStructure),
  Joi.array().items(propertyStructure),
];

const update = [Joi.object(propertyStructure)];

export default { create, update };
