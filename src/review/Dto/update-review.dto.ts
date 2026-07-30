import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(
  OmitType(CreateReviewDto, ['product'] as const),
) {} //partial type : m4 hywrth kol 7aga y3ny bra7tk w hy5ly el product constant
