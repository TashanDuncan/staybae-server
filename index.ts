import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validation/validateEnv';
import PropertyController from '@/resources/property/property.controller';

validateEnv();

const app = new App([
    new PropertyController()
], Number(process.env.PORT));

app.listen();