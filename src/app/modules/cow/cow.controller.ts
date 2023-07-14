import { RequestHandler } from 'express';
import { ICow } from './cow.interface';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { CowService } from './cow.service';
import { pick } from '../../../shared/pick';
import { cowFilterableFields } from './cow.constants';
import { paginationFields } from '../../../constants/pagination';
import { JwtPayload } from 'jsonwebtoken';

const createCow: RequestHandler = catchAsync(async (req, res) => {
  const { ...cowData } = req.body;
  const result = await CowService.createCow(cowData);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow created successfully',
    data: result,
  });
});

const getAllCows: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, cowFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CowService.getAllCows(filters, paginationOptions);
  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cows retrived successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCow: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await CowService.getSingleCow(id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow retrived successfully',
    data: result,
  });
});

const deleteCow: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const seller: JwtPayload | null = req?.user;

  const result = await CowService.deleteCow(id, seller);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully',
    data: result,
  });
});

const updateCow: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const seller: JwtPayload | null = req?.user;

  const result = await CowService.updateCow(id, updateData, seller);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'cow updated successfully',
    data: result,
  });
});

export const CowController = {
  createCow,
  getAllCows,
  getSingleCow,
  deleteCow,
  updateCow,
};
