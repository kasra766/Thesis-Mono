import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: dto.productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const totalPrice = Number(product.price) * dto.quantity;

    return this.prisma.order.create({
      data: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
        totalPrice,
      },
    });
  }

  async findMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.prisma.order.findMany({
      include: {
        user: true,
        product: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
