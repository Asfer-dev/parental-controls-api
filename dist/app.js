"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const index_1 = __importDefault(require("./routes/index"));
const children_routes_1 = __importDefault(require("./routes/children.routes"));
const restrictions_routes_1 = __importDefault(require("./routes/restrictions.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const screenTime_routes_1 = __importDefault(require("./routes/screenTime.routes"));
const logs_routes_1 = __importDefault(require("./routes/logs.routes"));
const cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*", // or restrict to specific domains
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/", index_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/children", children_routes_1.default);
app.use("/children", restrictions_routes_1.default);
app.use("/children", screenTime_routes_1.default);
app.use("/children", logs_routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
