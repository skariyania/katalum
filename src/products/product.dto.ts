import { IsString } from 'class-validator';

class CreateProductDto {
    @IsString()
    public name: string;
}
export default CreateProductDto;
