import PropertyModel from './property.model';
import Property from './property.interface';
import moment from 'moment';
import axios from 'axios'

export const create = async (propertyDetails: Property) => {
  console.log(propertyDetails);

  try {
    return await PropertyModel.create(propertyDetails);
  } catch (error) {
    throw new Error('Unable to create new property');
  }
};

export const createMany = async (properties: Property[]) => {
  try {
    return await PropertyModel.insertMany(properties);
  } catch (error) {
    throw new Error('Unable to create new property');
  }
};

export const getAll = async () => {
  try {
    return await PropertyModel.find({});
  } catch (error) {
    throw new Error('Unable to retrieve properties');
  }
};

export const update = async (id: string, propertyDetails: Property) => {
  try {
    const property = await getPropertyById(id);

    property.overwrite(propertyDetails);
    return await property.save();
  } catch (error) {
    throw new Error('Unable to update property details');
  }
};

export const remove = async (id: string) => {
  try {
    const property = getPropertyById(id);

    return await PropertyModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Unable to delete property');
  }
};

export const getPropertyById = async (id: string) => {
  try {
    const property = await PropertyModel.findById(id);

    if (!property) {
      throw new Error(`Unable to find property matching ID ${id}`);
    }
    return property;
  } catch (error: any) {
    throw new Error(`Unable to retrieve property details using ${id}`);
  }
};

export const getNearbyPlacesById = async (id: string) => {
  try {
    const property = await PropertyModel.findById(id);
    const lat = property?.lat
    const lon = property?.lon
    const places = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lon}`,
          radius: 1000,
          type:'restaurant',
          key:  process.env.GOOGLE_MAPS_API_KEY
        },
      })

    if (!property) {
      throw new Error(`Unable to find property matching ID ${id}`);
    }
    if (!places) {
      throw new Error(`Unable to find places matching Lat:${lat} or Lon: ${lon}`);

    }
    return places.data;
  } catch (error: any) {
    throw new Error(`Unable to retrieve property details using ${id}`);
  }
};

export const getBySearch = async (fromDate: any, toDate: any, city: any, region: any) => {
  try {
    const properties = await PropertyModel.find({});
    let matches: Property[] = [];

    console.log(
      `Searching for properties from ${fromDate} to ${toDate} at location ${city}`
    );

    if (properties) {
      const searchFrom = formatToDateObj(fromDate);
      const searchTo = formatToDateObj(toDate);

      matches = properties.filter((property) => {
        const fromAsDate = formatToDateObj(property.dateFrom);
        const toAsDate = formatToDateObj(property.dateTo);

        if (region) {
          if (region?.toLowerCase() === 'worldwide') {
            return (
              moment(fromAsDate).isSameOrAfter(searchFrom) &&
              moment(toAsDate).isSameOrBefore(searchTo)
            )
          }

          return (
            moment(fromAsDate).isSameOrAfter(searchFrom) &&
            moment(toAsDate).isSameOrBefore(searchTo) &&
            property.region.toLowerCase() === region.toLowerCase()
          )
        }
 
        return (
          moment(fromAsDate).isSameOrAfter(searchFrom) &&
          moment(toAsDate).isSameOrBefore(searchTo) &&
          property.city.toLowerCase() === city.toLowerCase()
        );
      });
    }

    return matches;
  } catch (error: any) {
    throw new Error(
      `Unable to retrieve property details using from date ${fromDate} and to date ${toDate}`
    );
  }
};

const formatToDateObj = (dateStr: string) => moment(dateStr).toDate();
