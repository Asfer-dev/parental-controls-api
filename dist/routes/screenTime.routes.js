"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const screenTime_controller_1 = require("../controllers/screenTime.controller");
const catchAsync_1 = require("../utils/catchAsync");
const router = express_1.default.Router();
router.post("/:id/screen-time", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(screenTime_controller_1.setScreenTimeLimit));
router.get("/:id/screen-time", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(screenTime_controller_1.getScreenTime));
router.post("/:id/lock", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(screenTime_controller_1.lockChild));
router.post("/:id/unlock", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(screenTime_controller_1.unlockChild));
exports.default = router;
