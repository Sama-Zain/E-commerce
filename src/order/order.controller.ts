import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/common/services/auth.guard';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("checkOut")
  checkOut(@Body() createOrderDto: CreateOrderDto , @Req() req:any) {
    const userId = req.user._id;
    return this.orderService.checkOut( userId , createOrderDto );
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }
}