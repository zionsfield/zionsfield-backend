import express, { Request, Response } from "express";
import { cookieName } from "../constants";
import { requireAuth } from "../middlewares/require-auth";
import {
  addSession,
  addTerm,
  getSessions,
  getTerms,
} from "../services/terms.service";
import { cookieConfig } from "../utils";

const router = express.Router();

router
  .route("/api/terms")
  .get(requireAuth, async (req: Request, res: Response) => {
    const terms = await getTerms();
    return res.json({ data: terms, message: "Terms returned" });
  })
  .post(requireAuth, async (req: Request, res: Response) => {
    await addTerm();
    res.cookie(cookieName, "", cookieConfig);
    return res.status(201).json({ message: "Term added" });
  });

router
  .route("/api/sessions")
  .get(requireAuth, async (req: Request, res: Response) => {
    const sessions = await getSessions();
    return res.json({ data: sessions, message: "Sessions returned" });
  })
  .post(requireAuth, async (req: Request, res: Response) => {
    await addSession();
    res.cookie(cookieName, "", cookieConfig);
    return res.status(201).json({ message: "Session added" });
  });

export { router as termsRoutes };
