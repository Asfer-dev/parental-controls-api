"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const restrictions_controller_1 = require("../controllers/restrictions.controller");
const catchAsync_1 = require("../utils/catchAsync");
const router = express_1.default.Router();
router.post("/:id/restrictions", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(restrictions_controller_1.setRestrictions));
router.get("/:id/restrictions", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(restrictions_controller_1.getRestrictions));
router.put("/:id/restrictions", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(restrictions_controller_1.updateRestrictions));
exports.default = router;
