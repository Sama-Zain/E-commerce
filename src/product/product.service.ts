import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, HBrandDocument } from 'src/DB/Models/brand.model';
import {
  HProductDocument,
  Product,
  ProductModel,
} from 'src/DB/Models/product.model';
import { CreateProductDto } from './DTO/create.product.dto';
import { CreateBrandDto } from 'src/brand/DTO/create-brand.dto';
import { UpdateProductDto } from './DTO/update.product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<HProductDocument>,
    @InjectModel(Brand.name) private readonly brandModel: Model<HBrandDocument>,
  ) {}

  private async validateBrandCategoryRElationShip(
    brandId: string,
    categoryId: string,
  ): Promise<void> {
    const brand = await this.brandModel.findById(brandId);
    if (!brand) throw new NotFoundException('Brand Not Found');

    const supportedCategoryId = brand.categories.map((category) =>
      category.toString(),
    );

    if (!supportedCategoryId.includes(categoryId))
      throw new NotFoundException(
        `Category with id ${categoryId} is not supported by brand with id ${brandId}`,
      );
  }

  async create(
    dto: CreateProductDto,
    imageUrl: string,
    adminId: string,
  ): Promise<HProductDocument> {
    await this.validateBrandCategoryRElationShip(dto.brand, dto.category);

    const newProduct = new this.productModel({
      ...dto,
      image: imageUrl,
      createdBy: adminId,
    });

    return (await newProduct.save()).populate(
      'brand category createdBy',
      '-password',
    );
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    imageUrl?: string,
  ): Promise<HProductDocument | null> {
    const existingProduct = await this.productModel.findById(id);
    if (!existingProduct) throw new NotFoundException(`Product Not Found`);

    if (dto.brand || dto.category) {
      await this.validateBrandCategoryRElationShip(
        dto.brand || existingProduct.brand,
        dto.category || existingProduct.category,
      );
    }
    const updatedPayload: any = {
      ...dto,
    };

    if (imageUrl) updatedPayload.image = imageUrl;
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updatedPayload,
      { new: true },
    );
    return updatedProduct;
  }

  async findAll() {
    return await this.productModel
      .find()
      .populate('brand category createdBy', '-password');
  }

  async findById(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('brand category createdBy', '-password');
    if (!product) {
      throw new NotFoundException(`product with this ID : ${id} not found`);
    }
    return product;
  }
}
