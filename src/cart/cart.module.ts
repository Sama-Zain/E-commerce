import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { ProductModel } from 'src/DB/Models/product.model';
import { CartModel } from 'src/DB/Models/cart.model';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/Token.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [UserModel, ProductModel, CartModel,CacheModule],
  controllers: [CartController],
  providers: [CartService, JwtService, TokenService],
})
export class CartModule {}
