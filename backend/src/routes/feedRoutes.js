// codeProjects/gudeats/backend/src/routes/feedRoutes.js

import express from "express";
import { list } from "../controllers/feedController.js";

const router = express.Router();

router.get("/", list);

export default router;
