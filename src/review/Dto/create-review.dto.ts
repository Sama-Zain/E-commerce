import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: `REVIEW comment is required` })
  @Length(2, 100, {
    message: `Category Name must be between 2 and 100 charcters`,
  })
  @Transform(({ value }) => value?.trim())
  comment!: string;

  @IsNumber()
  @IsInt()
  @IsNotEmpty({ message: `review rating is required` })
  @Min(1, { message: 'review rating must be between 1 and 5 ' })
  @Type(() => Number)
  rating!: number;

  @IsMongoId({ message: 'product Id must be a valid ObjectId' })
  @IsNotEmpty({ message: `product id  rating is required` })
  product!: string;
}
