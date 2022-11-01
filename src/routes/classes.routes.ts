import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { ClassModel } from "../models/classes.model";

const router = express.Router();

router.get("/api/classes", async (req: Request, res: Response) => {
  const classes = await ClassModel.find().sort({ level: "asc" });
  res.json({ data: classes });
});

export { router as classesRoutes };
