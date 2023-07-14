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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowService = void 0;
const paginationHelper_1 = require("../../../helper/paginationHelper");
const cow_constants_1 = require("./cow.constants");
const cow_model_1 = require("./cow.model");
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const user_model_1 = require("../user/user.model");
const createCow = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const seller = yield user_model_1.User.find({ _id: payload === null || payload === void 0 ? void 0 : payload.seller });
    if (seller.length === 0) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Seller not found');
    }
    const result = (yield cow_model_1.Cow.create(payload)).populate('seller');
    return result;
});
const getAllCows = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: cow_constants_1.cowSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => {
                if (field === 'maxPrice') {
                    return {
                        price: { $lte: value },
                    };
                }
                else if (field === 'minPrice') {
                    return {
                        price: { $gte: value },
                    };
                }
                else {
                    return {
                        [field]: value,
                    };
                }
            }),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortCondition = sortBy &&
        sortOrder && { [sortBy]: sortOrder };
    const whereCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const result = yield cow_model_1.Cow.find(whereCondition)
        .populate('seller')
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = yield cow_model_1.Cow.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getSingleCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id).populate('seller');
    return result;
});
const deleteCow = (id, seller) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is the owner of this cow or not.
    const isSellerMatch = yield cow_model_1.Cow.findOne({
        $and: [{ _id: id }, { seller: seller && (seller === null || seller === void 0 ? void 0 : seller.id) }],
    });
    if (!isSellerMatch) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'your are not authorized to delete this cow.');
    }
    const result = yield cow_model_1.Cow.findByIdAndDelete(id).populate('seller');
    return result;
});
const updateCow = (id, payload, seller) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.Cow.findOne({ _id: id });
    if (!isExist) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'cow not found');
    }
    // check if the user is the owner of this cow or not.
    const isSellerMatch = yield cow_model_1.Cow.findOne({
        $and: [{ _id: id }, { seller: seller && (seller === null || seller === void 0 ? void 0 : seller.id) }],
    });
    if (!isSellerMatch) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'your are not authorized to update this cow');
    }
    const result = yield cow_model_1.Cow.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    }).populate('seller');
    return result;
});
exports.CowService = {
    createCow,
    getAllCows,
    getSingleCow,
    deleteCow,
    updateCow,
};
