import HttpException from "./HttpException";

class CategoryNotFoundExcetion extends HttpException {
    constructor(id: string) {
        super(404, `Category with id ${id} not found`);
    }
}
export default CategoryNotFoundExcetion;
