"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cow = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cow_constants_1 = require("./cow.constants");
const { Schema } = mongoose_1.default;
const cowSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        enum: cow_constants_1.location,
        required: true,
    },
    breed: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    label: {
        type: String,
        enum: cow_constants_1.label,
        required: true,
    },
    category: {
        type: String,
        enum: cow_constants_1.category,
        required: true,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Cow = mongoose_1.default.model('Cow', cowSchema);
