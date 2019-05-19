import * as express from 'express';
import Category from './category.interface';
import categoryModel from './categories.model';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';

import CategoryExistException from '../exceptions/CategoryExistException';
import CategoryNotFoundExcetion from '../exceptions/CategoryNotFoundException';
import ParentCategoryNotExistException from '../exceptions/ParentCategoryNotExistException';

import aggregations from './category.aggregations';

import CreateCategoryDto from './category.dto';


class CategoriesController implements Controller {
  public path = '/categories';
  public router = express.Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get(this.path, this.getAllCategories);
    this.router.get(`${this.path}/:id`, this.getCategoryById);
    this.router.post(this.path,
                      validationMiddleware(CreateCategoryDto),
                      this._generateCategoryPath,
                      this.categoryNameValidator,
                      this.parentCategoryVaidator,
                      this.createCategory
                    );
    this.router.patch(`${this.path}/:id`,
                      validationMiddleware(CreateCategoryDto),
                      this._generateCategoryPath,
                      this.categoryNameValidator,
                      this.parentCategoryVaidator,
                      this.modifyCategory);
    this.router.delete(`${this.path}/:id`, this.removeCategory);
  }
 
  getAllCategories = (request: express.Request, response: express.Response) => {
    categoryModel.aggregate(aggregations.materializedCategory)
    .then(categories => {
      response.send(categories);
    });
  }
 
  createCategory = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const categoryData: Category = request.body;
    const createCategory = new categoryModel(categoryData); 
    createCategory.save()
      .then((savedCategory) => {
        response.send(savedCategory);
      }).catch(next); //passing errors to express's error handler
  }

  getCategoryById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    categoryModel.findById(id)
    .then((category) => {
      if(category) {
        response.send(category);
      } else {
        next(new CategoryNotFoundExcetion(id));
      }
    }).catch(next); //passing errors to express's error handler
  }

  modifyCategory = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    const categoryData: Category = request.body;
    categoryModel.findByIdAndUpdate(id, categoryData, { "new": true }).then((category) => {
      if(category) {
        response.send(category);
      } else {
        next(new CategoryNotFoundExcetion(id));
      }
    }).catch(next); //passing errors to express's error handler
  }

  removeCategory = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const id = request.params.id;
    categoryModel.findByIdAndRemove(id).then((ack) => {
      if(ack) {
        response.sendStatus(200);
      } else {
        next(new CategoryNotFoundExcetion(id));
      }
    }).catch(next); //passing errors to express's error handler
  }

  private _generateCategoryPath = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const categoryData: Category = request.body;
    if(categoryData.parent !== '/') {
      categoryData.category = `${categoryData.parent}${categoryData.category}`;
    }
    next();
  }

  private parentCategoryVaidator = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const categoryData: Category = request.body;
    if(categoryData.parent === "/") {
      return next();
    }
    const parentRegex = new RegExp(`^${categoryData.parent}`);
    categoryModel.countDocuments({'category': parentRegex })
      .then(count => {
        if(count == 0) {
          next(new ParentCategoryNotExistException(categoryData.parent));
        } else {
          next();
        }
      });
  }

  private categoryNameValidator = (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const categoryData: Category = request.body;

    categoryModel.countDocuments({ $or: [
        { 'category': categoryData.category },
        { 'name': categoryData.name }
      ]})
      .then(count => {
        if(count > 0) {
          next(new CategoryExistException(categoryData));
        } else {
          next();
        }
      });
  }
}
export default CategoriesController;
