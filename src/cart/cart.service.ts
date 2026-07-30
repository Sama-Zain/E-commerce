import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { cart, HCartDocument } from 'src/DB/Models/cart.model';
import { HProductDocument, Product } from 'src/DB/Models/product.model';
import { addToCartDto } from './DTO/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(cart.name)
    private readonly cartModel: Model<HCartDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<HProductDocument>,
  ) {}

  private reCalculateCartTotal(cart: HCartDocument) {
    let total = 0;

    for (const item of cart.items) {
      item.subTotal = item.quantity * item.pricePerUnit;
      total += item.subTotal;
    }

    cart.totalPrice = total;
  }

  async getCart(userId: string) {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product');

    if (!cart) {
      cart = new this.cartModel({
        user: userId,
        items: [],
        totalPrice: 0,
      });

      await cart.save();
    }

    return cart;
  }

  async addToCart(userId: string, dto: addToCartDto) {
    const { productId, quantity } = dto;

    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Not Enough Stock Available');
    }

    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new this.cartModel({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      const targetNewQuantity =
        cart.items[existingItemIndex].quantity + quantity;

      if (product.stock < targetNewQuantity) {
        throw new BadRequestException('Not Enough Stock Available');
      }

      cart.items[existingItemIndex].quantity = targetNewQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        pricePerUnit: Number(product.price),
        subTotal: quantity * Number(product.price),
      });
    }

    this.reCalculateCartTotal(cart);

    return (await cart.save()).populate('items.product');
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      throw new NotFoundException('Cart Not Found');
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    this.reCalculateCartTotal(cart);

    return (await cart.save()).populate('items.product');
  }
}
