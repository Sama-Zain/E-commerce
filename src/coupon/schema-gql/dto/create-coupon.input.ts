import { Field, InputType, Int } from "@nestjs/graphql";
import { IsDateString, IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

@InputType()
export class CreateCouponDto {
    @Field(() => String)
    @IsString()
    @IsNotEmpty({ message: 'Coupon Code is required' })
    code!: string;

    @Field(() => Int)
    @IsInt()
    @IsNotEmpty({ message: 'Coupon Code is required' })
    @Max(100, { message: 'Discount cannot exceed 100%' })
    discountPercentage!: number;

    @Field(() => String)
    @IsDateString({}, { message: "Epiry Date must be a vaild ISO data string" })
    expiryDate!: number
    @Field(() => Int)
    @IsInt()
    @Min(1)
    maxUsage!: number

}