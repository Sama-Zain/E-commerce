import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/common/services/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { addToCartDto } from './DTO/add-to-cart.dto';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
    @UseInterceptors(HttpCacheInterceptor)
  async getCart(@Req() req: any) {
    const userId = req.user._id;
    return await this.cartService.getCart(userId);
  }

  @Post('add')
  async addToCart(@Req() req: any, @Body() dto: addToCartDto) {
    const userId = req.user._id;
    return await this.cartService.addToCart(userId, dto);
  }

  @Patch('item/:productId')
  async removeItem(@Req() req: any, @Param('productId') productId: string) {
    const userId = req.user._id;
    return await this.cartService.removeItem(userId, productId);
  }
}
