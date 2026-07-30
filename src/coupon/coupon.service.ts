import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCouponDto } from './DTO/create-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, HCouponDocument } from 'src/DB/Models/coupon.model';
import { Model } from 'mongoose';
import { UpdateCouponDto } from './DTO/update-coupon';

@Injectable()
export class CouponService {
    constructor(@InjectModel(Coupon.name) private readonly couponModel:Model<HCouponDocument>){}

async create(dto: CreateCouponDto , adminId:string){
    const cleanCode = dto.code.toUpperCase().trim();
    const existsing = await this.couponModel.findOne({code:cleanCode});

    if(existsing) throw new ConflictException("a coupon with this code already exists");

    const newCoupon = new this.couponModel({
        ...dto , code:cleanCode , createdBy:adminId
    })

    return await newCoupon.save();
 }

 async findAll(){
    return this.couponModel.find().populate(`createdBy firstName lastName  email`)
 }

 async update(id : string , dto :UpdateCouponDto){
    const updated = await this.couponModel.findByIdAndUpdate(id , dto , {new:true});

    if (!updated ) throw new NotFoundException(`Coupon Not Found`);
    return updated;

 }

 async validatCoupon (code : string , userId : string){
    const coupon = await this.couponModel.findOne({code:code.toUpperCase().trim()});

    if (!coupon) throw new NotFoundException(` Coupon Not Found`)
     
    if (new Date() > coupon.expiredDate ){
        throw new BadRequestException(`this coupon has expired`)
    }
    if(coupon.usedCound > coupon.maxUsage){
        throw new BadRequestException(`this coupon has reached its maximum`);

    }
    const hasUsed = coupon.usedBy.map((id)=>id.toString()).includes(userId);
    if (hasUsed){
        throw new BadRequestException (` you have already redeemed this Coupon`)
    }
    return coupon;
 }
}