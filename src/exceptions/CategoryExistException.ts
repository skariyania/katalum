import HttpException from "./HttpException";
import Category from "categories/category.interface";

class CategoryExistException extends HttpException {
    constructor(categoryData: Category) {
        super(400, `Category name:'${categoryData.name}' OR category:'${categoryData.category}' already exist`);
    }
}
export default CategoryExistException;
