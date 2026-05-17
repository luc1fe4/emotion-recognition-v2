import type { RequestHandler } from "express";

import { getBatchJob, getBatchResults } from "../services/batch.service.js";

export const getJob: RequestHandler = async (req, res) => {
  const job = await getBatchJob(req.params.jobId);
  res.json({ success: true, data: job });
};

export const getJobResults: RequestHandler = async (req, res) => {
  const results = await getBatchResults(req.params.jobId);
  res.json({ success: true, data: { items: results } });
};
