// codeProjects/gudeats/backend/src/routes/postRoutes.js

import express from "express";
import { create, list } from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, create);
router.get("/", list);

export default router;
