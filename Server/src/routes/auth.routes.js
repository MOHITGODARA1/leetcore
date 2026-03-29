import { Router } from "express";
import LoginUser from "../controllers/LoginUser.controller";

const router = Router();


router.post("/Login", LoginUser);


export default router;