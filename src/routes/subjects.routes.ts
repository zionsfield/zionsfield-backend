import express, { Request, Response } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { SubjectAttrs, SubjectModel } from "../models/subject.model";

const router = express.Router();

router
  .route("/api/subjects")
  .get(async (req: Request, res: Response) => {
    const subjects = await SubjectModel.find();
    res.json({ data: subjects });
  })
  .post(async (req: Request<{}, {}, SubjectAttrs[]>, res) => {
    for (const subject of req.body) {
      if (await SubjectModel.findOne(subject)) continue;
      else await SubjectModel.build(subject).save();
    }
    res.status(201).json({
      data: await SubjectModel.find(),
    });
  });

export { router as subjectsRoutes };
