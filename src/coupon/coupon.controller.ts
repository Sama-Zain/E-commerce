import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './DTO/create-coupon.dto';
import { UpdateCouponDto } from './DTO/update-coupon';
import { AuthGuard } from 'src/common/services/auth.guard';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';

@Controller('coupon')
@UseGuards(AuthGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}
   
  @Post()
  create (@Body() createCouponDto:CreateCouponDto , @Req() req:any){
     const adminId = req.user._id;
     return this.couponService.create(createCouponDto , adminId)
  }

  @Post('validate')
  validatCoupon(@Body() code:string , @Req() req:any){
    const userId = req.user._id;
    return this.couponService.validatCoupon(code , userId)
  }

  @Get()
    @UseInterceptors(HttpCacheInterceptor)
  findAll(){
    return this.couponService.findAll();
  }

  @Patch()
  update(@Param() id : string , updateCouponDto : UpdateCouponDto){
    return this.couponService.update(id , updateCouponDto)
  }
}