import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { IAdmin, ILoginAdmin, ILoginAdminResponse } from './admin.interface';
import { Admin } from './admin.model';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helper/jwtHelpers';

const createAdmin = async (payload: IAdmin): Promise<IAdmin | null> => {
  const result = await Admin.create(payload);
  return result;
};

const login = async (payload: ILoginAdmin): Promise<ILoginAdminResponse> => {
  // instance of admin
  const admin = new Admin();
  const isAdminExist = await admin.isAdminExist(payload.phoneNumber);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  if (
    isAdminExist?.password &&
    !(await admin.isPasswordMatch(payload.password, isAdminExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'password is incorrect');
  }

  const accessToken = jwtHelpers.createToken(
    {
      id: isAdminExist._id,
      role: isAdminExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    {
      id: isAdminExist._id,
      role: isAdminExist.role,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const AdminService = {
  createAdmin,
  login,
};
