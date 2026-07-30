import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, HBrandDocument } from 'src/DB/Models/brand.model';
import { Category, HCategoryDocument } from 'src/DB/Models/category.model';
import { CreateBrandDto } from './DTO/create-brand.dto';
import { UpdateBrandDto } from './DTO/update.brand.dto';
@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<HBrandDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<HCategoryDocument>,
  ) {}

  private async validateCategoriesExists(
    categoriesIDs: string[],
  ): Promise<void> {
    if (categoriesIDs.length === 0) return;

    const existingCategories = await this.categoryModel.countDocuments({
      _id: { $in: categoriesIDs },
    });

    if (existingCategories !== categoriesIDs.length) {
      throw new BadRequestException(
        'One or more assigned category IDs do not exist in the database.',
      );
    }
  }

  async create(dto: CreateBrandDto, logoUrl: string, adminId: string) {
    await this.validateCategoriesExists(dto.categories);

    const brand = await this.brandModel.findOne({
      name: dto.name,
    });

    if (brand) {
      throw new ConflictException('Brand already exists');
    }

    const newBrand = new this.brandModel({
      ...dto,
      logo: logoUrl,
      createdBy: adminId,
    });

    return newBrand.save();
  }

  async update(dto: UpdateBrandDto, id: string, logoUrl?: string) {
    if (dto.categories) {
      await this.validateCategoriesExists(dto.categories);
    }

    const updatedPayload: any = { ...dto };

    if (logoUrl) {
      updatedPayload.logo = logoUrl;
    }

    const updated = await this.brandModel.findByIdAndUpdate(
      id,
      updatedPayload,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Brand document not found');
    }

    return updated;
  }

  async FindAll() {
    return this.brandModel
      .find()
      .populate('createdBy', 'firstName lastName email');
  }

  async findById(id: string) {
    const brand = await this.brandModel.findById(id).populate('createdBy');

    if (!brand) {
      throw new NotFoundException("Brand doesn't exist");
    }

    return brand;
  }
}
