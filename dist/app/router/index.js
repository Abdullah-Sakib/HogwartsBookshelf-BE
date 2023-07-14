"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = require("../modules/user/user.router");
const auth_router_1 = require("../modules/auth/auth.router");
const cow_router_1 = require("../modules/cow/cow.router");
const order_router_1 = require("../modules/order/order.router");
const admin_route_1 = require("../modules/admin/admin.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        router: auth_router_1.AuthRouter,
    },
    {
        path: '/users',
        router: user_router_1.UserRouter,
    },
    {
        path: '/cows',
        router: cow_router_1.CowRouter,
    },
    {
        path: '/orders',
        router: order_router_1.OrderRouter,
    },
    {
        path: '/admins',
        router: admin_route_1.AdminRouter,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.router));
exports.default = router;
