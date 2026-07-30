import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: `Category Name is required` })
  @Length(2, 100, {
    message: `Category Name must be between 2 and 100 charcters`,
  })
  @Transform(({ value }) => value?.trim())
  name!: string;

  @IsNumber()
  @IsNotEmpty({ message: `product price is required` })
  @Min(0, { message: 'Product Price must be a positive number ' })
  @Type(() => Number)
  price!: number;

  @IsNumber()
  @IsNotEmpty({ message: `product stock is required` })
  @Min(0, { message: 'Product stock must be a positive number ' })
  @Type(() => Number)
  stock!: number;

  @IsMongoId({ message: 'Brand Id must be a valid ObjectId' })
  @IsNotEmpty()
  brand!: string;

  @IsMongoId({ message: 'Category Id must be a valid ObjectId' })
  @IsNotEmpty()
  category!: string;
}
