import { CouponService } from './../coupon.service';
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Coupon } from "src/DB/Models/coupon.model";
import { CreateCouponDto } from '../DTO/create-coupon.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/services/auth.guard';

@Resolver(() => Coupon)
export class CouponResolver {
    constructor(private readonly couponService: CouponService) { }
    //Query:Fetch All Data
    @Query(() => [Coupon], { name: "getCoupons" })
    async findAll() {
        return this.couponService.findAll();
    }
    // Mutation
    @Mutation(() => Coupon, { name: "createCoupon" })
    @UseGuards(AuthGuard)
    async createCoupon( 
        @Args("input") input: CreateCouponDto,
        @Context() context:any,
    ){
        const adminId = context.req.user._id;
        return this.couponService.create(input,adminId)
        
    }

}