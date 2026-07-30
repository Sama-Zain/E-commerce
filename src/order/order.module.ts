import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { OrderModel } from 'src/DB/Models/order.model';
import { ProductModel } from 'src/DB/Models/product.model';
import { CouponModel } from 'src/DB/Models/coupon.model';
import { CartModel } from 'src/DB/Models/cart.model';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/Token.service';

@Module({
  imports:[UserModel , OrderModel , ProductModel , CouponModel , CartModel],
  controllers: [OrderController],
  providers: [OrderService , JwtService , TokenService],
})
export class OrderModule {}