import { Router } from "express";

import { getJob, getJobResults } from "../controllers/jobs.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";

const router = Router();

router.get("/:jobId", asyncHandler(getJob));
router.get("/:jobId/results", asyncHandler(getJobResults));

export default router;
