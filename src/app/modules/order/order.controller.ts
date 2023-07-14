import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { OrderService } from './order.service';
import { IOrder } from './order.interface';
import { JwtPayload } from 'jsonwebtoken';

const createOrder: RequestHandler = catchAsync(async (req, res) => {
  const orderDetails = req.body;
  const result = await OrderService.createOrder(orderDetails);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow created successfully',
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const user: JwtPayload | null = req?.user;

  const result = await OrderService.getAllOrders(user);

  sendResponse<IOrder[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'orders retrived successfully',
    data: result,
  });
});

const getSpecificOrder = catchAsync(async (req, res) => {
  const orderId = req.params.id;
  const user: JwtPayload | null = req.user;

  const result = await OrderService.getSpecificOrder(user, orderId);

  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'order retrived successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getSpecificOrder,
};
