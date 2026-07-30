import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBrandDto } from 'src/brand/DTO/create-brand.dto';
import { HProductDocument, Product } from 'src/DB/Models/product.model';
import { HReviewDocument, Review } from 'src/DB/Models/review.model';
import { CreateReviewDto } from './Dto/create-review.dto';
import { UpdateReviewDto } from './Dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<HReviewDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<HProductDocument>,
  ) {}

  async create(dto: CreateReviewDto, userId: string) {
    const productExists = await this.productModel.exists({ _id: dto.product });
    if (!productExists) {
      throw new NotFoundException('Product Not Found');
    }

    const alreadyReviewed = await this.reviewModel.exists({
      product: dto.product,
      user: userId,
    });
    if (alreadyReviewed) {
      throw new ConflictException('You have already review this product');
    }

    const newReview = new this.reviewModel({
      ...dto,
      user: userId,
    });

    return (await newReview.save()).populate(
      'user',
      'firstName lastName email',
    );
  }

  async update(reviewId: string, dto: UpdateReviewDto, userId: string) {
    const review = await this.reviewModel.findOne({
      _id: reviewId,
      user: userId,
    });
    if (!review) {
      throw new NotFoundException('Review not Found');
    }
    if (dto.rating) review.rating = dto.rating;
    if (dto.comment) review.comment = dto.comment;

    return (await review.save()).populate('user', 'firstName lastName email');
  }

  async findByProduct(productId: string) {
    return this.reviewModel
      .find({ product: productId })
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }

  async deleteReview(reviewId: string, userId: string) {
    const result = await this.reviewModel.deleteOne({
      _id: reviewId,
      user: userId,
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Review Not Found ');
    }
    return { message: 'Review Deleted successfully' };
  }
}
