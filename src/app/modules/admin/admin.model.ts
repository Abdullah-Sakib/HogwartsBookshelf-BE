/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose, { Schema } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

const adminSchema = new Schema<IAdmin, AdminModel>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['admin'],
    },
    password: {
      type: String,
      required: true,
      unique: true,
      select: 0,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    address: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password; // Exclude password field from the response
      },
    },
  }
);

adminSchema.methods.isAdminExist = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, '_id' | 'role' | 'password'> | null> {
  return await Admin.findOne(
    { phoneNumber },
    { _id: 1, role: 1, password: 1 }
  ).select('+password');
};

adminSchema.methods.isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return bcrypt.compare(givenPassword, savedPassword);
};

adminSchema.pre('save', async function (next) {
  // hasing the password before saving into the database
  const admin = this;
  admin.password = await bcrypt.hash(
    admin.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const Admin = mongoose.model<IAdmin, AdminModel>('Admin', adminSchema);
