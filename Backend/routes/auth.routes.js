import express from "express"
import { login, logOut, singup } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post("/signup", singup)
authRouter.post("/sign-up", singup)
authRouter.post("/signin", login)
authRouter.post("/sign-in", login)
authRouter.get("/logout", logOut)
export default authRouter