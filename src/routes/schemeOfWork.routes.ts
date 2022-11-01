import express, { Request, Response } from "express";
import { cookieName } from "../constants";
import { requireAuth } from "../middlewares/require-auth";
import { requireStudent } from "../middlewares/require-student";
import { requireTeacher } from "../middlewares/require-teacher";
import { validateResource } from "../middlewares/validate-resource";
import {
  CreateSOWInput,
  createSOWSchema,
} from "../schemas/schemeOfWork.schema";
import {
  createSOW,
  deleteSOW,
  editSOW,
  getSOW,
} from "../services/schemeOfWork.service";
import { cookieConfig } from "../utils";
import { idSchema } from "../utils/schemas";
import { SOWFilter } from "../utils/typings";

const router = express.Router();

router
  .route("/api/schemes")
  .get(
    requireAuth,
    requireStudent,
    async (req: Request<{}, {}, {}, SOWFilter>, res: Response) => {
      return res.json({
        data: await getSOW(req.query),
        message: "Scheme of work returned",
      });
    }
  )
  .post(
    requireAuth,
    requireTeacher,
    validateResource(createSOWSchema),
    async (req: Request<{}, {}, CreateSOWInput>, res: Response) => {
      return res.status(201).json({
        data: await createSOW(req.body),
        message: "Scheme of work added",
      });
    }
  );

router
  .route("/api/schemes/:id")
  .put(
    requireAuth,
    requireTeacher,
    validateResource(createSOWSchema),
    validateResource(idSchema),
    async (req: Request<{ id: string }, {}, CreateSOWInput>, res: Response) => {
      return res.json({
        data: await editSOW(req.params.id, req.body),
        message: "Scheme of work edited",
      });
    }
  )
  .delete(
    requireAuth,
    requireTeacher,
    validateResource(idSchema),
    async (req: Request<{ id: string }, {}, {}>, res: Response) => {
      return res.json({
        data: await deleteSOW(req.params.id),
        message: "Scheme of work deleted",
      });
    }
  );

export { router as schemeOfWorkRoutes };
