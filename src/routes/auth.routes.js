import express from "express";
import AuthController from "../controllers/Auth.controller.js";
const app = express();
const authrouter = express.Router();

/**
 * @name="/api/auth/register"
 */
authrouter.post("/register", AuthController.Register);
/**
 * @name="/api/auth/login"
 */
authrouter.post("/login", AuthController.Login);

export default authrouter