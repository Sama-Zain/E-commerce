import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Brand {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
  })
  logo!: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy!: string;

  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Category',
  })
  categories!: string[];
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
export type HBrandDocument = HydratedDocument<Brand>;
export const BrandModel = MongooseModule.forFeature([
  {
    name: Brand.name,
    schema: BrandSchema,
  },
]);
