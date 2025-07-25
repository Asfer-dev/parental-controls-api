"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const Log_1 = __importDefault(require("../models/Log"));
const logActivity = async (childId, type, message) => {
    try {
        await Log_1.default.create({ childId, type, message });
    }
    catch (err) {
        console.error("Logging failed:", err);
    }
};
exports.logActivity = logActivity;
