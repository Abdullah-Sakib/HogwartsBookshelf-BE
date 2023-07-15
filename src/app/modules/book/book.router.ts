import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookValidation } from './book.validation';
import { BookController } from './book.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(BookValidation.createBookZodValidation),
  BookController.createBook
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  BookController.getSingleBook
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  BookController.deleteBook
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(BookValidation.updateBookZodValidation),
  BookController.updateBook
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  BookController.getAllBooks
);

export const BookRouter = router;
