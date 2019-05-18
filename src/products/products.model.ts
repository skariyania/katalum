import * as mongoose from 'mongoose';
import Product from './product.interface';

const productSchema = new mongoose.Schema({
    name: String,
    categories: [String],
    price: Number
});

const productModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);

export default productModel;
