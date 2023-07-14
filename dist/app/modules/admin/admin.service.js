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
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const admin_model_1 = require("./admin.model");
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.Admin.create(payload);
    return result;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // instance of admin
    const admin = new admin_model_1.Admin();
    const isAdminExist = yield admin.isAdminExist(payload.phoneNumber);
    if (!isAdminExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Admin not found');
    }
    if ((isAdminExist === null || isAdminExist === void 0 ? void 0 : isAdminExist.password) &&
        !(yield admin.isPasswordMatch(payload.password, isAdminExist.password))) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'password is incorrect');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: isAdminExist._id,
        role: isAdminExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        id: isAdminExist._id,
        role: isAdminExist.role,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.AdminService = {
    createAdmin,
    login,
};
