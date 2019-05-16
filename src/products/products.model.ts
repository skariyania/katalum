import * as mongoose from 'mongoose';
import Product from './product.interface';

const productSchema = new mongoose.Schema({
    name: String,
});

const productModel = mongoose.model<Product & mongoose.Document>('Product', productSchema);

export default productModel;
