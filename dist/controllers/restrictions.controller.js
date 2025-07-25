"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRestrictions = exports.getRestrictions = exports.setRestrictions = void 0;
const Child_1 = __importDefault(require("../models/Child"));
const mongoose_1 = __importDefault(require("mongoose"));
const setRestrictions = async (req, res) => {
    const { id } = req.params;
    const { chatEnabled, purchaseAllowed, screenTimeLimit, allowedHours } = req.body;
    const child = await Child_1.default.findOne({ _id: id, parentId: req.userId });
    if (!child)
        return res.status(404).json({ message: "Child not found or unauthorized" });
    child.restrictions = {
        chatEnabled,
        purchaseAllowed,
        screenTimeLimit,
        allowedHours,
    };
    await child.save();
    return res.json({
        message: "Restrictions set",
        restrictions: child.restrictions,
    });
};
exports.setRestrictions = setRestrictions;
const getRestrictions = async (req, res) => {
    const { id } = req.params;
    const child = await Child_1.default.findOne({ _id: id, parentId: req.userId });
    if (!child)
        return res.status(404).json({ message: "Child not found or unauthorized" });
    return res.json({ restrictions: child.restrictions });
};
exports.getRestrictions = getRestrictions;
const updateRestrictions = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid child ID" });
    }
    const child = await Child_1.default.findOne({ _id: id, parentId: req.userId });
    if (!child)
        return res.status(404).json({ message: "Child not found or unauthorized" });
    child.restrictions = {
        ...child.restrictions,
        ...updates,
    };
    await child.save();
    return res.json({
        message: "Restrictions updated",
        restrictions: child.restrictions,
    });
};
exports.updateRestrictions = updateRestrictions;
