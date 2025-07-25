"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const children_controller_1 = require("../controllers/children.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const catchAsync_1 = require("../utils/catchAsync");
const router = express_1.default.Router();
router.post("/", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(children_controller_1.createChild));
router.get("/", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(children_controller_1.getAllChildren));
router.put("/:id", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(children_controller_1.updateChild));
router.delete("/:id", auth_middleware_1.authenticateToken, (0, catchAsync_1.catchAsync)(children_controller_1.deleteChild));
exports.default = router;
