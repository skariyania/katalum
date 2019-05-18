import HttpException from "./HttpException";

class ParentCategoryNotExistException extends HttpException {
    constructor(parent: string) {
        super(404, `Parent category ${parent} does not exist`);
    }
}
export default ParentCategoryNotExistException;
