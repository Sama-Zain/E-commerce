import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { CouponModel } from 'src/DB/Models/coupon.model';
import {  JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common/services/Token.service';
import { CacheModule } from 'src/cache/cache.module';
import { CouponResolver } from './schema-gql/coupon.resolver';

@Module({
  imports:[UserModel , CouponModel,CacheModule],
  controllers: [CouponController],
  providers: [CouponService , JwtService , TokenService,CouponResolver],
})
export class CouponModule {}