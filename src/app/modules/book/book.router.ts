import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CowValidation } from './book.validation';
import { BookController } from './book.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(CowValidation.createCowZodValidation),
  BookController.createBook
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
  BookController.getSingleBook
);

router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), BookController.deleteBook);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(CowValidation.updateCowZodValidation),
  BookController.updateBook
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
  BookController.getAllBooks
);

export const CowRouter = router;
