import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create.product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {} //partial type : m4 hywrth kol 7aga y3ny bra7tk
