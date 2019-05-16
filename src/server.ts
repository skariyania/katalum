
import 'dotenv/config';
import App from './app';
import ProductsController from './products/products.controller';

import validateEnv from './utils/validateEnv';
validateEnv();

const app = new App(
    [
        new ProductsController(),
    ],
);

app.listen();
