import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
    return (request, resposne, next) => {
        validate(plainToClass(type, request.body), { skipMissingProperties })
            .then((errors: ValidationError[]) => {
                if(errors.length > 0) {
                    const message = errors.map((error: ValidationError) =>
                        Object.values(error.constrains)).join(', ');
                    next(new HttpException(400, message));
                } else {
                    next();
                }
            }).catch((err) => {
                next(err);               
            });
    }
}
export default validationMiddleware;