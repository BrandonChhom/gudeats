// codeProjects/gudeats/backend/src/routes/userRoutes.js

import express from "express";
import { profile, posts } from "../controllers/userController.js";
import { follow, unfollow, status } from "../controllers/followController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:username", profile);
router.get("/:username/posts", posts);

router.post("/:username/follow", protect, follow);
router.delete("/:username/follow", protect, unfollow);
router.get("/:username/follow", protect, status);

export default router;
