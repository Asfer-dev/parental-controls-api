"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlockChild = exports.lockChild = exports.getScreenTime = exports.setScreenTimeLimit = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Child_1 = __importDefault(require("../models/Child"));
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
const setScreenTimeLimit = async (req, res, next) => {
    const { id } = req.params;
    const { screenTimeLimit } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.AppError("Invalid child ID", 400);
    }
    const child = await Child_1.default.findOne({ _id: id, parentId: req.userId });
    if (!child)
        throw new AppError_1.AppError("Child not found or unauthorized", 404);
    child.restrictions.screenTimeLimit = screenTimeLimit;
    await child.save();
    res.json({ message: "Screen time limit updated", screenTimeLimit });
};
exports.setScreenTimeLimit = setScreenTimeLimit;
const getScreenTime = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.AppError("Invalid child ID", 400);
    }
    const child = await Child_1.default.findOne({ _id: id, parentId: req.userId });
    if (!child)
        throw new AppError_1.AppError("Child not found or unauthorized", 404);
    res.json({
        isLocked: child.isLocked,
        screenTimeLimit: child.restrictions.screenTimeLimit,
        allowedHours: child.restrictions.allowedHours,
    });
};
exports.getScreenTime = getScreenTime;
const lockChild = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.AppError("Invalid child ID", 400);
    }
    const child = await Child_1.default.findOne({ _id: id, parentId: req.userId });
    if (!child)
        throw new AppError_1.AppError("Child not found or unauthorized", 404);
    child.isLocked = true;
    await child.save();
    await (0, logger_1.logActivity)(child._id.toString(), "lock", `Child account manually locked`);
    res.json({ message: "Child has been locked" });
};
exports.lockChild = lockChild;
const unlockChild = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new AppError_1.AppError("Invalid child ID", 400);
    }
    const child = await Child_1.default.findOne({ _id: id, parentId: req.userId });
    if (!child)
        throw new AppError_1.AppError("Child not found or unauthorized", 404);
    child.isLocked = false;
    await child.save();
    await (0, logger_1.logActivity)(child._id.toString(), "unlock", `Child account manually unlocked`);
    res.json({ message: "Child has been unlocked" });
};
exports.unlockChild = unlockChild;
