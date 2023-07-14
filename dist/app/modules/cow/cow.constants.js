"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cowFilterableFields = exports.cowSearchableFields = exports.category = exports.label = exports.location = void 0;
exports.location = [
    'Dhaka',
    'Chattogram',
    'Barishal',
    'Rajshahi',
    'Sylhet',
    'Comilla',
    'Rangpur',
    'Mymensingh',
];
exports.label = ['for sale', 'sold out'];
exports.category = ['Dairy', 'Beef', 'DualPurpose'];
exports.cowSearchableFields = ['location', 'breed', 'category'];
exports.cowFilterableFields = [
    'searchTerm',
    'location',
    'price',
    'age',
    'name',
    'breed',
    'weight',
    'category',
    'minPrice',
    'maxPrice',
];
