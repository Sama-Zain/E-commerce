import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, HydrateOptions, Mongoose } from 'mongoose';
@ObjectType()
@Schema({
  timestamps: true,
})
export class Coupon {
  @Field(() => ID)
  _id!: string;

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    toUpperCase: true,
  })
  code!: string;

  @Field(() => Int)
  @Prop({
    type: Number,
    required: true,
    min: 1,
    max: 100,
  })
  discount!: number;

  @Field(() => String)
  @Prop({
    type: Date,
    required: true,
  })
  expiredDate!: Date;

  @Field(() => Int)
  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  maxUsage!: number;

  @Field(() => Int)
  @Prop({
    type: Number,
    min: 0,
  })
  usedCound!: number;

  @Field(() => [ID])
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  })
  usedBy!: string[];

  @Field(() => ID)
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: string;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
export type HCouponDocument = HydratedDocument<Coupon>;
export const CouponModel = MongooseModule.forFeature([
  {
    name: Coupon.name,
    schema: CouponSchema,
  },
]);
