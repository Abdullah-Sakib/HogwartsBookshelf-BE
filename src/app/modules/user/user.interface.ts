/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type IUser = {
  _id: string;
  password: string;
  role: 'seller' | 'buyer';
  name: {
    firstName: string;
    lastName: string;
  };
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
};

export type IUserMethods = {
  isUserExist(
    phoneNumber: string
  ): Promise<Pick<IUser, 'role' | 'password' | '_id'> | null>;

  isPasswordMatch(givenPassword: string, savedPassword: string): boolean;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

export type IUserFilter = {
  searchTerm?: string;
  role?: string;
  phoneNumber?: string;
  address?: string;
};
