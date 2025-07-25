"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogs = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Log_1 = __importDefault(require("../models/Log"));
const Child_1 = __importDefault(require("../models/Child"));
const AppError_1 = require("../utils/AppError");
const getLogs = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.AppError("Invalid child ID", 400);
    }
    const child = await Child_1.default.findOne({ _id: id, parentId: req.userId });
    if (!child)
        throw new AppError_1.AppError("Child not found or unauthorized", 404);
    const logs = await Log_1.default.find({ childId: id }).sort({ timestamp: -1 });
    res.json({ logs });
};
exports.getLogs = getLogs;
