"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const cow_model_1 = require("../cow/cow.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("./order.model");
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const [buyer, cow] = yield Promise.all([
        user_model_1.User.findById(payload.buyer),
        cow_model_1.Cow.findById(payload.cow),
    ]);
    if (!buyer) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'buyer not found');
    }
    if (!cow) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'cow not found');
    }
    if (cow.label === 'sold out') {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'this cow has already been sold out');
    }
    if (cow.price > buyer.budget) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'you need more money to buy this cow');
    }
    const session = yield mongoose_1.default.startSession();
    let orderData = null;
    try {
        session.startTransaction();
        const cowResult = yield cow_model_1.Cow.findByIdAndUpdate(payload.cow, {
            label: 'sold out',
        }, { new: true, session });
        const buyerResult = yield user_model_1.User.findByIdAndUpdate(payload.buyer, {
            budget: buyer.budget - cow.price,
        }, { new: true, session });
        const sellerResult = yield user_model_1.User.findByIdAndUpdate(cow.seller, {
            income: cow.price,
        }, { new: true, session });
        const updatedDocForOrder = {
            cow: cowResult,
            buyer: buyerResult,
            seller: sellerResult,
            price: cow.price,
        };
        const result = yield order_model_1.Order.create([updatedDocForOrder], { session });
        if (!result.length) {
            throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to order');
        }
        orderData = result[0];
        yield session.commitTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'User creation failed');
    }
    if (orderData) {
        orderData = yield order_model_1.Order.findOne({ _id: orderData._id })
            .populate('seller')
            .populate('buyer')
            .populate('cow');
    }
    return orderData;
});
const getAllOrders = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if ((user === null || user === void 0 ? void 0 : user.role) === 'buyer') {
        result = yield order_model_1.Order.find({ buyer: user === null || user === void 0 ? void 0 : user.id })
            .populate('seller')
            .populate('buyer')
            .populate('cow');
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'seller') {
        result = yield order_model_1.Order.find({ seller: user === null || user === void 0 ? void 0 : user.id })
            .populate('seller')
            .populate('buyer')
            .populate('cow');
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
        result = yield order_model_1.Order.find({})
            .populate('seller')
            .populate('buyer')
            .populate('cow');
    }
    return result;
});
const getSpecificOrder = (user, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if ((user === null || user === void 0 ? void 0 : user.role) === 'buyer') {
        result = yield order_model_1.Order.findOne({
            $and: [{ _id: orderId }, { buyer: user.id }],
        })
            .populate('seller')
            .populate('buyer')
            .populate('cow');
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'seller') {
        result = yield order_model_1.Order.findOne({
            $and: [{ _id: orderId }, { seller: user.id }],
        })
            .populate('seller')
            .populate('buyer')
            .populate('cow');
    }
    else if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
        result = yield order_model_1.Order.findById(orderId)
            .populate('seller')
            .populate('buyer')
            .populate('cow');
    }
    if (!result) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    return result;
});
exports.OrderService = {
    createOrder,
    getAllOrders,
    getSpecificOrder,
};
