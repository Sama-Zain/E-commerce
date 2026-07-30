import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from 'src/category/DTO/create.category.dto';
import { UpdateCategoryDto } from 'src/category/DTO/update.category.dto';
import { Category, HCategoryDocument } from 'src/DB/Models/category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<HCategoryDocument>,
  ) {}

  async create(dto: CreateCategoryDto, logoUrl: string, adminId: string) {
    const category = await this.categoryModel.findOne({
      name: this.categoryModel.name,
    });

    if (category) throw new ConflictException(`Category Already Exist`);

    const newCategory = new this.categoryModel({
      ...dto,
      logo: logoUrl,
      createdBy: adminId,
    });

    return newCategory.save();
  }

  async update(
    dto: UpdateCategoryDto,
    logoUrl: string | undefined,
    id: string,
  ) {
    const updatedPayload = { ...dto }; //destract el dto 34an a2dr amsk 7aga mo3ina

    if (logoUrl) updatedPayload.logo = logoUrl; //hna mskt el logourl

    const updated = await this.categoryModel.findByIdAndUpdate(
      id,
      updatedPayload,
      { new: true }, // de lazem 34an b y update w yrg3ly el data el gdeda
    );

    if (!updated) throw new NotFoundException(`Category Document not found`);
    return updated;
  }

  async FindAll() {
    return this.categoryModel
      .find()
      .populate('createdBy', 'firstName lastName email');
  }

  async findById(id: string) {
    const category = await this.categoryModel
      .findById(id)
      .populate('createdBy');
    if (!category) throw new NotFoundException(`Category doesn't exist`);

    return category;
  }
}
