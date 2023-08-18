import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/property/property.validation';
import * as propertyService from '@/resources/property/property.service';

class PropertyController implements Controller {
  public path = '/properties';
  public router = Router();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}`,
      validationMiddleware(validate.create),
      this.create
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(validate.update),
      this.update
    );
    this.router.delete(`${this.path}/:id`, this.delete);
    this.router.get(`${this.path}`, this.getAll);
    this.router.get(`${this.path}/:id`, this.retrieveOne);
    this.router.get(`${this.path}/:id/places`, this.retrievePlaces);
  }

  private retrievePlaces = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const places = await propertyService.getNearbyPlacesById(req.params.id);
      res.status(200).json(places);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  }

  private retrieveOne = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const property = await propertyService.getPropertyById(req.params.id);
      res.status(200).json(property);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      let properties;

      if (req.query.from && req.query.to) {
        console.log('Querying properties ...');

        properties = await propertyService.getBySearch(
          req.query.from,
          req.query.to,
          req.query.city,
          req.query.region
        );
      } else {
        properties = await propertyService.getAll();
      }

      res.status(200).json(properties);
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const property = Array.isArray(req.body)
        ? await propertyService.createMany(req.body)
        : await propertyService.create(req.body);

      res.status(201).json({ property });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const property = await propertyService.update(req.params.id, req.body);

      res.status(200).json({ property });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      await propertyService.remove(req.params.id);

      res.status(200).json({ id: req.params.id });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}

export default PropertyController;
