import HttpException from "./HttpException";

class ProductNotFoundExcetion extends HttpException {
    constructor(id: string) {
        super(404, `Product with id ${id} not found`);
    }
}
export default ProductNotFoundExcetion;
