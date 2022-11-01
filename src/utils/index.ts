import { CookieOptions } from "express";
import { Role } from "../enums";
import { ClassModel } from "../models/classes.model";
import { SOWModel } from "../models/schemeOfWork.model";
import { SubjectModel } from "../models/subject.model";
import { TermDoc, TermModel } from "../models/terms.model";
import { UserModel } from "../models/users.model";
import { createSOW } from "../services/schemeOfWork.service";
import { getTerms } from "../services/terms.service";

const setupClasses = async () => {
  const classes = await ClassModel.find({});
  const classNames = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];
  if (classes.length === 0) {
    classNames.forEach(async (className, i) => {
      await ClassModel.build({
        className,
        level: i + 1,
      }).save();
    });
  }
};

const setupSubjects = async () => {
  const subjects = await SubjectModel.find({});
  const subjectNames = ["Mathematics", "English"];
  if (subjects.length === 0) {
    subjectNames.forEach(async (name) => {
      await SubjectModel.build({
        name,
      }).save();
    });
  }
};

const createUsers = async () => {
  const users = await UserModel.find({});
  if (users.length === 0) {
    await UserModel.build({
      name: "Teacher",
      username: "teacher",
      password: "password",
      role: Role.TEACHER,
    }).save();
    await UserModel.build({
      name: "Admin 1",
      username: "student",
      password: "password",
      role: Role.STUDENT,
    }).save();
  }
};

const loadTestData = async () => {
  const subjects = await SubjectModel.find();
  const classes = await ClassModel.find();
  const sow = await SOWModel.find();
  if (sow.length === 0) {
    await createSOW({
      class: classes[0].id,
      subject: subjects[0].id,
      content: "Content 1",
    });
  }
};

export const setup = async () => {
  const terms = await getTerms();
  let term: TermDoc | undefined;
  if (terms.length === 0) {
    term = await TermModel.build({
      term: 1,
      startYear: 2022,
      endYear: 2023,
    }).save();
  }
  await setupClasses();
  await setupSubjects();
  await createUsers();
  process.env.NODE_ENV === "development" && (await loadTestData());
};

const cookieConfig: CookieOptions = {
  signed: false,
  expires: new Date(Date.now() + 18 * 60 * 60 * 1000),
};
if (process.env.NODE_ENV === "production") {
  cookieConfig.secure = true;
  cookieConfig.sameSite = "none";
} else {
  cookieConfig.sameSite = false;
}
export { cookieConfig };
