/* eslint-disable no-unused-vars */
// import { Model } from 'mongoose';

export type IWishlist = {
  _id: string;
  userId: string;
  email: string;
  bookId?: string;
  wishlist: string[];
};

// export type WishlistModel = Model<IWishlist, Record<string, unknown>>;
