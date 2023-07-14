import express from 'express';
import { UserRouter } from '../modules/user/user.router';
import { AuthRouter } from '../modules/auth/auth.router';
import { CowRouter } from '../modules/cow/cow.router';
import { OrderRouter } from '../modules/order/order.router';
import { AdminRouter } from '../modules/admin/admin.route';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    router: AuthRouter,
  },
  {
    path: '/users',
    router: UserRouter,
  },
  {
    path: '/cows',
    router: CowRouter,
  },
  {
    path: '/orders',
    router: OrderRouter,
  },
  {
    path: '/admins',
    router: AdminRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.router));

export default router;
