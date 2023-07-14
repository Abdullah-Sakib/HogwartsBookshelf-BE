import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AdminService } from './admin.service';
import sendResponse from '../../../shared/sendResponse';
import { IAdmin, ILoginAdminResponse } from './admin.interface';
import httpStatus from 'http-status';
import config from '../../../config';

const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const { ...adminData } = req.body;
  const result = await AdminService.createAdmin(adminData);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'admin created successfully',
    data: result,
  });
});

const login: RequestHandler = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;
  const result = await AdminService.login(loginData);

  const { refreshToken, ...accessToken } = result;

  // set refresh token into the browser cookie
  const cookieOptions = {
    secure: config.node_env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginAdminResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'admin logged in successfully',
    data: accessToken,
  });
});

export const AdminController = {
  createAdmin,
  login,
};
