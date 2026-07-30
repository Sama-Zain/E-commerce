import { IsDateString, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty({message:  'Coupon Code is required' })
    code!: string;
    
    @IsInt()
    @IsNotEmpty({message:  'Coupon Code is required' })
    @Max(100,{message: 'Discount cannot exceed 100%'})
    discountPercentage! : number; 

    @IsDateString({},{ message: "Epiry Date must be a vaild ISO data string"})
    expiryDate!: number

    @IsInt()
    @Min(1)
    maxUsage!:number

}