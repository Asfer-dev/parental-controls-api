import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.routes";
import indexRoutes from "./routes/index";
import childrenRoutes from "./routes/children.routes";
import restrictionRoutes from "./routes/restrictions.routes";
import { errorHandler } from "./middleware/error.middleware";
import screenTimeRoutes from "./routes/screenTime.routes";
import logsRoutes from "./routes/logs.routes";
import sessionRoutes from "./routes/session.routes";
import passwordResetRoutes from "./routes/passwordReset.routes";
import cors from "cors";

var app = express();

app.use(
  cors({
    origin: "*", // or restrict to specific domains
    credentials: true,
  })
);
app.options("*", cors()); // Allow preflight for all routes

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/children", childrenRoutes);
app.use("/children", restrictionRoutes);
app.use("/children", screenTimeRoutes);
app.use("/children", logsRoutes);
app.use("/", sessionRoutes);
app.use("/", passwordResetRoutes);

app.use(errorHandler);

export default app;
