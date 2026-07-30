import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty({ message: `Category Name is required` })
  @Length(2, 20, {
    message: `Category Name must be between 2 and 20 charcters`,
  })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: `Category Name is required` })
  logo!: string;

  @IsArray({ message: `Categories must be an array` })
  @IsMongoId({ each: true, message: `category ID must be a valid ObjectId` }) // check if rl id elly galo da objectId
  categories!: string[];
}
