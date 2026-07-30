import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, HydrateOptions, Mongoose } from 'mongoose';
import { OrderStatusEnum } from 'src/common/enums/orderEnum';

@Schema({
  _id: false,
})
export class OrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  })
  product!: string;

  @Prop({
    type: Number,
    required: true,
  })
  quantity!: number;

  @Prop({
    type: Number,
    required: true,
  })
  priceSnapShot!: number;
}

export class ShippedAddress {
  @Prop({
    type: String,
    required: true,
  })
  city!: string;

  @Prop({
    type: Number,
    required: true,
  })
  postalCode!: number;

  @Prop({
    type: String,
    required: true,
  })
  region!: string;
}

export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user!: string;

  @Prop({
    type: [OrderItem],
    required: true,
  })
  items!: OrderItem[];

  @Prop({
    type: Number,
    required: true,
  })
  subTotal!: number;

  @Prop({
    type: Number,
    default: 0,
  })
  discountAmount!: number;

  @Prop({
    type: Number,
    required: true,
  })
  finalPrice!: number;

  @Prop({
    type: String,
    enum: Object.values(OrderStatusEnum),
    default: OrderStatusEnum.PENDING,
  })
  status!: number;

  @Prop({
    type: String,
    required: true,
  })
  shippedAddress!: ShippedAddress[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
  })
  appliedCoupon?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type HOrderDocument = HydratedDocument<Order>;
export const OrderModel = MongooseModule.forFeature([
  {
    name: Order.name,
    schema: OrderSchema,
  },
]);