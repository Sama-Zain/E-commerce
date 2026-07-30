
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {

    @IsString()
    @IsNotEmpty({message: "Shipping Address is Required"})
    shippingAddress!:string

    @IsString()
    @IsOptional()
    couponCode?:string
}