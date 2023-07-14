"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFilterableFields = exports.UserSearchableFields = exports.role = void 0;
exports.role = ['seller', 'buyer'];
exports.UserSearchableFields = [
    'role',
    'phoneNumber',
    'name.firstname',
    'name.middlename',
    'name.lastname',
];
exports.UserFilterableFields = [
    'searchTerm',
    'role',
    'phoneNumber',
    'address',
];
