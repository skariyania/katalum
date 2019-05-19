import * as express from 'express';
import Product from './product.interface';
import productModel from './products.model';
import Controller from 'interfaces/controller.interface';
import ProductNotFoundExcetion from '../exceptions/ProductNotFoundException';
import validationMiddleware from '../middleware/validation.middleware';
import CreateProductDto from './product.dto';

class ProductsController implements Controller {
  public path = '/products';
  public router = express.Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get(this.path, this.getAllProducts);
    this.router.post(this.path, validationMiddleware(CreateProductDto), this.createProduct);
    this.router.get(`${this.path}/:id`, this.getProductById);
    this.router.patch(`${this.path}/:id`, validationMiddleware(CreateProductDto), this.modifyProduct);
    this.router.delete(`${this.path}/:id`, this.removeProduct);
  }
 
  getAllProducts = (request: express.Request, response: express.Response) => {
    productModel.find(request.query)
    .then(products => {
      response.send(products);
    });
  }
 
  createProduct = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const productData: Product = request.body;
    const createProduct = new productModel(productData); 
    createProduct.save()
      .then((savedProduct) => {
        response.send(savedProduct);
      }).catch(next); //passing errors to express's error handler
  }

  getProductById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    productModel.findById(id)
    .then((product) => {
      if(product) {
        response.send(product);
      } else {
        next(new ProductNotFoundExcetion(id));
      }
    }).catch(next); //passing errors to express's error handler
  }

  modifyProduct = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const productData: Product = request.body;
    productModel.findByIdAndUpdate(id, productData, { "new": true }).then((product) => {
      if(product) {
        response.send(product);
      } else {
        next(new ProductNotFoundExcetion(id));
      }
    }).catch(next); //passing errors to express's error handler
  }

  removeProduct = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    productModel.findByIdAndRemove(id).then((ack) => {
      if(ack) {
        response.sendStatus(200);
      } else {
        next(new ProductNotFoundExcetion(id));
      }
    }).catch(next); //passing errors to express's error handler
  }
}
 
export default ProductsController;