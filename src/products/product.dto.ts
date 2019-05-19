import { IsString, IsNumber, IsArray } from 'class-validator';

class CreateProductDto {
    @IsString()
    public name: string;

    @IsArray()
    public categories: string[];

    @IsNumber()
    public price: string;
}
export default CreateProductDto;
