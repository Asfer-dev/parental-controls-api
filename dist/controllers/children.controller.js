"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChild = exports.updateChild = exports.getAllChildren = exports.createChild = void 0;
const Child_1 = __importDefault(require("../models/Child"));
const createChild = async (req, res) => {
    const { name, age, gameUserId } = req.body;
    if (!req.userId)
        return res.status(401).json({ message: "Unauthorized" });
    if (!name || !age || !gameUserId)
        return res.status(400).json({ message: "Missing child data" });
    const child = new Child_1.default({
        parentId: req.userId,
        name,
        age,
        gameUserId,
    });
    await child.save();
    return res.status(201).json({ message: "Child added successfully", child });
};
exports.createChild = createChild;
const getAllChildren = async (req, res) => {
    if (!req.userId)
        return res.status(401).json({ message: "Unauthorized" });
    const children = await Child_1.default.find({ parentId: req.userId });
    return res.json({ children });
};
exports.getAllChildren = getAllChildren;
const updateChild = async (req, res) => {
    const { id } = req.params;
    const { name, age, gameUserId } = req.body;
    if (!req.userId)
        return res.status(401).json({ message: "Unauthorized" });
    const child = await Child_1.default.findOne({ _id: id, parentId: req.userId });
    if (!child)
        return res.status(404).json({ message: "Child not found" });
    if (name)
        child.name = name;
    if (age)
        child.age = age;
    if (gameUserId)
        child.gameUserId = gameUserId;
    await child.save();
    return res.json({ message: "Child updated", child });
};
exports.updateChild = updateChild;
const deleteChild = async (req, res) => {
    const { id } = req.params;
    if (!req.userId)
        return res.status(401).json({ message: "Unauthorized" });
    const deleted = await Child_1.default.findOneAndDelete({
        _id: id,
        parentId: req.userId,
    });
    if (!deleted)
        return res.status(404).json({ message: "Child not found or not yours" });
    return res.json({ message: "Child deleted successfully" });
};
exports.deleteChild = deleteChild;
