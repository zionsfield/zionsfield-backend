import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { SubjectModel } from "../models/subject.model";

const router = express.Router();

router.get("/api/subjects", async (req: Request, res: Response) => {
  const subjects = await SubjectModel.find();
  res.json({ data: subjects });
});

export { router as subjectsRoutes };
