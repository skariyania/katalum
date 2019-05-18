import { IsString, IsNumber, IsArray } from 'class-validator';
import { isArray } from 'util';
import { plugin } from 'mongoose';

class CreateProductDto {
    @IsString()
    public name: string;

    @IsArray()
    public categories: string[];

    @IsNumber()
    public price: string;
}
export default CreateProductDto;
