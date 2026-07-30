import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateCategoryDto } from './create.category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {} //partial type : m4 hywrth kol 7aga y3ny bra7tk
