
import 'dotenv/config';
import App from './app';
import ProductsController from './products/products.controller';
import CategoriesController from './categories/categories.controller';

import validateEnv from './utils/validateEnv';
validateEnv();

const app = new App(
    [
        new ProductsController(),
        new CategoriesController()
    ],
);
app.listen();
