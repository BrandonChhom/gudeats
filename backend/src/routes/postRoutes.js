// codeProjects/gudeats/backend/src/routes/postRoutes.js

import express from "express";
import { create, list } from "../controllers/postController.js";
import { like, unlike, status } from "../controllers/likeController.js";
import { create as createComment, list as listComments } from "../controllers/commentController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), create);
router.get("/", list);

router.post("/:postId/likes", protect, like);
router.delete("/:postId/likes", protect, unlike);
router.get("/:postId/likes", protect, status);

router.post("/:postId/comments", protect, createComment);
router.get("/:postId/comments", listComments);

export default router;
