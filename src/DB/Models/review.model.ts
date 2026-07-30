import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from './product.model';

@Schema({
  timestamps: true,
})
export class Review {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  })
  product!: string;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 5,
  })
  rating!: number;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  comment!: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
export type HReviewDocument = HydratedDocument<Review>;
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
export const ReviewModel = MongooseModule.forFeature([
  {
    name: Review.name,
    schema: ReviewSchema,
  },
]);
