"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const EmailVerificationSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    verified: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
});
exports.default = mongoose_1.default.model("EmailVerification", EmailVerificationSchema);
