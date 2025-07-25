"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChildSchema = new mongoose_1.default.Schema({
    parentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Parent" },
    name: String,
    age: Number,
    gameUserId: String,
    restrictions: {
        chatEnabled: { type: Boolean, default: true },
        purchaseAllowed: { type: Boolean, default: true },
        screenTimeLimit: { type: Number, default: 120 },
        allowedHours: [String],
    },
    isLocked: { type: Boolean, default: false },
    logs: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Log" }],
});
exports.default = mongoose_1.default.model("Child", ChildSchema);
