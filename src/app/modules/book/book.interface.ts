import { Model } from 'mongoose';

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publication_date: string;
  image: string;
  creator: string;
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilter = {
  searchTerm?: string;
  location?: string;
  price?: string;
  age?: number;
  name?: string;
  breed?: string;
  weight?: number;
  category?: string;
};
