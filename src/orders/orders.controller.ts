import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';

import { OrdersService } from './orders.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';

import { CurrentUser } from '../common/decorators/current-user.decorator';

import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    dto: CreateOrderDto,
  ) {
    return this.ordersService.create(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  myOrders(
    @CurrentUser()
    user: JwtPayload,
  ) {
    return this.ordersService.findMyOrders(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  allOrders(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.ordersService.findAll(Number(page), Number(limit));
  }
}
