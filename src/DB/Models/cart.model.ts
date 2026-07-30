import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  _id: false,
})
export class cartItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product!: string;

  @Prop({
    type: Number,
    required: true,
    min: 1,
    default: 1,
  })
  quantity!: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    default: 1,
  })
  pricePerUnit!: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  subTotal!: number;
}

@Schema({
  timestamps: true,
})
export class cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user!: string;

  @Prop({
    type: [cartItem],
    default: [],
  })
  items!: cartItem[];

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  totalPrice!: number;
}

export const CartSchema = SchemaFactory.createForClass(cart);
export type HCartDocument = HydratedDocument<cart>;
export const CartModel = MongooseModule.forFeature([
  {
    name: cart.name,
    schema: CartSchema,
  },
]);
