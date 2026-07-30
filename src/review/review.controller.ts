import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './Dto/create-review.dto';
import { UpdateReviewDto } from './Dto/update-review.dto';
import { AuthGuard } from 'src/common/services/auth.guard';
import { HttpCacheInterceptor } from 'src/cache/interceptor/cache.interceptor';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get(':productId')
    @UseInterceptors(HttpCacheInterceptor)
  async findByProduct(@Param() productId: string) {
    return this.reviewService.findByProduct(productId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: any,
  ) {
    const userId = req.user._id;
    return this.reviewService.create(createReviewDto, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: any,
    @Param() id: string,
  ) {
    const userId = req.user._id;
    return this.reviewService.update(id, updateReviewDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteReview(@Req() req: any, @Param() id: string) {
    const userId = req.user._id;
    return this.reviewService.deleteReview(id, userId);
  }
}
