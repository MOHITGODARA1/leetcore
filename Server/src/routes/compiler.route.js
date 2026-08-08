import { Router } from "express";
import { executeCode, getStarterCode, judgeCode } from "../controllers/compiler.controller.js";

const router = Router();

router.get("/compiler/starter", getStarterCode);
router.post("/compiler/execute", executeCode);
router.post("/compiler/judge", judgeCode);

export default router;
