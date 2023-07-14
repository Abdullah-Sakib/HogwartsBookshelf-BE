import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helper/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { cowSearchableFields } from './cow.constants';
import { ICow, ICowFilter } from './cow.interface';
import { Cow } from './cow.model';
import { IGenericResponse } from '../../../interfaces/common';
import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';

const createCow = async (payload: ICow): Promise<ICow | null> => {
  const seller = await User.find({ _id: payload?.seller });
  if (seller.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Seller not found');
  }
  const result = (await Cow.create(payload)).populate('seller');
  return result;
};

const getAllCows = async (
  filters: ICowFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICow[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === 'maxPrice') {
          return {
            price: { $lte: value },
          };
        } else if (field === 'minPrice') {
          return {
            price: { $gte: value },
          };
        } else {
          return {
            [field]: value,
          };
        }
      }),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: '' | { [key: string]: SortOrder } = sortBy &&
    sortOrder && { [sortBy]: sortOrder };

  const whereCondition =
    andConditions?.length > 0 ? { $and: andConditions } : {};

  const result = await Cow.find(whereCondition)
    .populate('seller')
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller');
  return result;
};

const deleteCow = async (
  id: string,
  seller: JwtPayload | null
): Promise<ICow | null> => {
  // check if the user is the owner of this cow or not.
  const isSellerMatch = await Cow.findOne({
    $and: [{ _id: id }, { seller: seller && seller?.id }],
  });
  if (!isSellerMatch) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'your are not authorized to delete this cow.'
    );
  }

  const result = await Cow.findByIdAndDelete(id).populate('seller');
  return result;
};

const updateCow = async (
  id: string,
  payload: Partial<ICow>,
  seller: JwtPayload | null
): Promise<ICow | null> => {
  const isExist = await Cow.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'cow not found');
  }

  // check if the user is the owner of this cow or not.
  const isSellerMatch = await Cow.findOne({
    $and: [{ _id: id }, { seller: seller && seller?.id }],
  });
  if (!isSellerMatch) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'your are not authorized to update this cow'
    );
  }

  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  }).populate('seller');

  return result;
};

export const CowService = {
  createCow,
  getAllCows,
  getSingleCow,
  deleteCow,
  updateCow,
};
