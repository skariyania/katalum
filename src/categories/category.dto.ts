import { IsString } from 'class-validator';

class CreateCategoryDto {
    @IsString()
    public name: string;

    @IsString()
    public parent: string;

    @IsString()
    public category: string;
}
export default CreateCategoryDto;
