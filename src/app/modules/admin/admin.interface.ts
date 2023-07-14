/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IAdmin = {
  _id: string;
  phoneNumber: string;
  role: 'admin';
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
};

export type ILoginAdmin = {
  phoneNumber: string;
  password: string;
};

export type ILoginAdminResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IAdminMethods = {
  isAdminExist(
    phoneNumber: string
  ): Promise<Pick<IAdmin, 'role' | 'password' | '_id'> | null>;

  isPasswordMatch(givenPassword: string, savedPassword: string): boolean;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>, IAdminMethods>;
