import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';

class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware(): void {
    this.express.use(morgan('dev'));
    this.express.use(helmet());
    this.express.use(
      cors({
        origin: ['https://staybae-frontend.onrender.com'],
      })
    );
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(compression());
  }

  private initialiseControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private initialiseErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private initialiseDatabaseConnection(): void {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, NODE_ENV } = process.env;
    const MONGO_PROTOCOL =
      NODE_ENV === 'development' ? 'mongodb' : 'mongodb+srv';
    mongoose.connect(
      `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
    );
  }

  public listen(): void {
    this.express.listen(this.port, () =>
      console.log(`Server listening on port ${this.port}`)
    );
  }
}

export default App;
