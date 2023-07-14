import express from 'express';
import { OrderController } from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  OrderController.getSpecificOrder
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.BUYER),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.BUYER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN),
  OrderController.getAllOrders
);

export const OrderRouter = router;
