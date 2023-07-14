import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { Cow } from '../cow/cow.model';
import { User } from '../user/user.model';
import { IOrder } from './order.interface';
import mongoose from 'mongoose';
import { Order } from './order.model';
import { JwtPayload } from 'jsonwebtoken';

const createOrder = async (payload: IOrder): Promise<IOrder | null> => {
  const [buyer, cow] = await Promise.all([
    User.findById(payload.buyer),
    Cow.findById(payload.cow),
  ]);

  if (!buyer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'buyer not found');
  }
  if (!cow) {
    throw new ApiError(httpStatus.NOT_FOUND, 'cow not found');
  }

  if (cow.label === 'sold out') {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'this cow has already been sold out'
    );
  }

  if (cow.price > buyer.budget) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'you need more money to buy this cow'
    );
  }

  const session = await mongoose.startSession();
  let orderData = null;
  try {
    session.startTransaction();
    const cowResult = await Cow.findByIdAndUpdate(
      payload.cow,
      {
        label: 'sold out',
      },
      { new: true, session }
    );

    const buyerResult = await User.findByIdAndUpdate(
      payload.buyer,
      {
        budget: buyer.budget - cow.price,
      },
      { new: true, session }
    );

    const sellerResult = await User.findByIdAndUpdate(
      cow.seller,
      {
        income: cow.price,
      },
      { new: true, session }
    );

    const updatedDocForOrder = {
      cow: cowResult,
      buyer: buyerResult,
      seller: sellerResult,
      price: cow.price,
    };

    const result = await Order.create([updatedDocForOrder], { session });

    if (!result.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to order');
    }

    orderData = result[0];

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed');
  }

  if (orderData) {
    orderData = await Order.findOne({ _id: orderData._id })
      .populate('seller')
      .populate('buyer')
      .populate('cow');
  }

  return orderData;
};

const getAllOrders = async (
  user: JwtPayload | null
): Promise<IOrder[] | null> => {
  let result = null;

  if (user?.role === 'buyer') {
    result = await Order.find({ buyer: user?.id })
      .populate('seller')
      .populate('buyer')
      .populate('cow');
  } else if (user?.role === 'seller') {
    result = await Order.find({ seller: user?.id })
      .populate('seller')
      .populate('buyer')
      .populate('cow');
  } else if (user?.role === 'admin') {
    result = await Order.find({})
      .populate('seller')
      .populate('buyer')
      .populate('cow');
  }

  return result;
};

const getSpecificOrder = async (
  user: JwtPayload | null,
  orderId: string
): Promise<IOrder | null> => {
  let result = null;

  if (user?.role === 'buyer') {
    result = await Order.findOne({
      $and: [{ _id: orderId }, { buyer: user.id }],
    })
      .populate('seller')
      .populate('buyer')
      .populate('cow');
  } else if (user?.role === 'seller') {
    result = await Order.findOne({
      $and: [{ _id: orderId }, { seller: user.id }],
    })
      .populate('seller')
      .populate('buyer')
      .populate('cow');
  } else if (user?.role === 'admin') {
    result = await Order.findById(orderId)
      .populate('seller')
      .populate('buyer')
      .populate('cow');
  }

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSpecificOrder,
};
