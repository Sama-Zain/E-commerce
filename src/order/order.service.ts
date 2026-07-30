import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HOrderDocument, Order } from 'src/DB/Models/order.model';
import { Model } from 'mongoose';
import { cart, HCartDocument } from 'src/DB/Models/cart.model';
import { HProductDocument, Product } from 'src/DB/Models/product.model';
import { Coupon, HCouponDocument } from 'src/DB/Models/coupon.model';
import { OrderStatusEnum } from 'src/common/enums/orderEnum';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<HOrderDocument>,
    @InjectModel(cart.name) private readonly cartModel: Model<HCartDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<HProductDocument>,
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<HCouponDocument>,
  ) {}

  async checkOut(userId: string, createOrderDto: CreateOrderDto) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart || cart.items.length === 0)
      throw new BadRequestException(
        `your check out pipline is failed :cart is empty`,
      );

    const orderItems: any[] = [];
    let calculatedSubTotal = 0;

    for (const item of cart.items) {
      const dbProduct = await this.productModel.findById(item.product);
      if (!dbProduct) {
        throw new NotFoundException(
          `CheckOut aboted . product Id ${item.product} no longer exist`,
        );
      }
      if (dbProduct.stock < item.quantity) {
        throw new NotFoundException(`Quantity doesn't exist`);
      }

      calculatedSubTotal += Number(dbProduct.price) * item.quantity;

      orderItems.push({
        prouct: item.product,
        quantity: item.quantity,
        priceSnapShot: dbProduct.price,
      });
    }

    let discountCoupon = 0;
    let targetCoupon: HCouponDocument | null = null;

    if (createOrderDto.couponCode) {
      targetCoupon = await this.couponModel.findOne({
        code: createOrderDto.couponCode.toUpperCase().trim(),
      });
      if (!targetCoupon)
        throw new NotFoundException(`this Coupon code is invalid`);

      if (new Date() > targetCoupon.expiredDate)
        throw new BadRequestException('this coupon has expired');
      if (targetCoupon.usedCound > targetCoupon.maxUsage)
        throw new BadRequestException('coupon usage cap hit');
      if (targetCoupon.usedBy.map((id) => id.toString().includes(userId)))
        throw new BadRequestException(`you have already used this coupon`);
      discountCoupon = (calculatedSubTotal * targetCoupon.discount) / 100;
    }
    const finalPrice = calculatedSubTotal - discountCoupon;

    for (const item of orderItems) {
      await this.productModel.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }
    if (targetCoupon) {
      await this.couponModel.findByIdAndUpdate(targetCoupon._id, {
        $inc: { usedCound: 1 },
        $push: { usedBy: userId },
      });
    }

    const Order = new this.orderModel({
      user: userId,
      items: orderItems,
      subTotal: calculatedSubTotal,
      discountAmount: discountCoupon,
      finalPrice,
      shippedAddress: createOrderDto.shippingAddress,
      appliedCoupon: targetCoupon?._id || null,
      status:OrderStatusEnum.PENDING
    });

     await Order.save();

    cart.items = [];
    cart.totalPrice=0;
    await cart?.save()

    return Order;
  }

  findAll() {
    return `This action returns all order`;
  }
}