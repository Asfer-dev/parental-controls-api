"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logs_controller_1 = require("../controllers/logs.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const catchAsync_1 = require("../utils/catchAsync");
const router = express_1.default.Router();
router.get("/:id/logs", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(logs_controller_1.getLogs));
exports.default = router;
