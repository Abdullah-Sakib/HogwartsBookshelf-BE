import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CowValidation } from './cow.validation';
import { CowController } from './cow.controller';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(CowValidation.createCowZodValidation),
  CowController.createCow
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
  CowController.getSingleCow
);

router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), CowController.deleteCow);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(CowValidation.updateCowZodValidation),
  CowController.updateCow
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.ADMIN),
  CowController.getAllCows
);

export const CowRouter = router;
