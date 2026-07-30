import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: `Category Name is required` })
  @Length(2, 20, {
    message: `Category Name must be between 2 and 20 charcters`,
  })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: `Category Name is required` })
  logo!: string;
}
