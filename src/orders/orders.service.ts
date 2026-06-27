import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const count = await this.prisma.order.count();

    const orders = await this.prisma.order.findMany({
      // include: {
      //   user: true,
      //   product: true,
      // },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      count,
      data: orders,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findMyOrders(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const count = await this.prisma.order.count({
      where: {
        userId,
      },
    });
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      // include: {
      //   product: true,
      // },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    return {
      count,
      data: orders,
    };
  }

  async findMyOrder(userId: string, id: string) {
    await this.findOne(id);

    return this.prisma.order.findUnique({
      where: {
        id,
        userId,
      },
      // include: {
      //   product: true,
      // },
    });
  }

  async update(id: string, dto: UpdateOrderDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.order.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Order deleted',
    };
  }
}
