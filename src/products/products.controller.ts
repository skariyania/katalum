import * as express from 'express';
import Product from './product.interface';
import productModel from './products.model'; 
import { request } from 'http';
import Controller from 'interfaces/controller.interface';

class ProductsController implements Controller {
  public path = '/products';
  public router = express.Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get(this.path, this.getAllProducts);
    this.router.post(this.path, this.createProduct);
    this.router.get(`${this.path}/:id`, this.getProductById);
    this.router.patch(`${this.path}/:id`, this.modifyProduct);
    this.router.delete(`${this.path}/:id`, this.removeProduct);
  }
 
  getAllProducts = (request: express.Request, response: express.Response) => {
    productModel.find()
    .then(products => {
      response.send(products);
    });
  }
 
  createProduct = (request: express.Request, response: express.Response, next: express.Next) => {
    const productData: Product = request.body;
    const createProduct = new productModel(productData); 
    createProduct.save()
      .then((savedProduct) => {
        response.send(savedProduct);
      }).catch(next); //passing errors to express's error handler
  }

  getProductById = (request: express.Request, response: express.Response, next: express.Next) => {
    const id = request.params.id;
    productModel.findById(id)
    .then((product) => {
      response.send(product)
    }).catch(next); //passing errors to express's error handler
  }

  modifyProduct = (request: express.Request, response: express.Response, next: express.Next) => {
    const id = request.params.id;
    const productData: Product = request.body;
    productModel.findByIdAndUpdate(id, productData, { "new": true, "useFindAndModify": false }).then((product) => {
      response.send(product)
    }).catch(next); //passing errors to express's error handler
  }

  removeProduct = (request: express.request, response: express.response, next: express.Next) => {
    const id = request.params.id;
    productModel.findByIdAndRemove(id, { "useFindAndModify": false }).then((ack) => {
      if(ack) {
        response.sendStatus(200);
      } else {
        response.sendStatus(404);
      }
    }).catch(next); //passing errors to express's error handler
  }
}
 
export default ProductsController;