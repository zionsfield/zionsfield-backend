import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { ClassModel } from "../models/classes.model";
import { SOWModel } from "../models/schemeOfWork.model";
import { SubjectModel } from "../models/subject.model";
import { TermModel } from "../models/terms.model";
import { CreateSOWInput } from "../schemas/schemeOfWork.schema";
import { SOWFilter } from "../utils/typings.d";

export const findSOWBy = async (by: string, value: any) => {
  return await SOWModel.findOne({ [by]: value });
};

export const findSOWByFilter = async (filter: SOWFilter) => {
  return await SOWModel.findOne(filter)
    .populate("subject")
    .populate("class")
    .populate("term")
    .exec();
};

export const findSOWSByFilter = async (filter: SOWFilter) => {
  const schemes = await SOWModel.find(filter)
    .populate("subject")
    .populate("class")
    .populate("term")
    .exec();
  const count = await SOWModel.find(filter).count();
  return { schemes, count };
};

/* Services */

export const createSOW = async (body: CreateSOWInput) => {
  const classObj = await ClassModel.findById(body.class);
  const subjectObj = await SubjectModel.findById(body.subject);
  const termObj = await TermModel.findById(body.term);
  if (!classObj) throw new NotFoundError("Class");
  if (!subjectObj) throw new NotFoundError("Subject");
  if (!termObj) throw new NotFoundError("Term");
  const sow = await findSOWByFilter({
    class: body.class,
    subject: body.subject,
    term: termObj.id,
  });
  if (sow)
    throw new BadRequestError(
      "Scheme of work for this subject, class, and term already exists"
    );
  return await SOWModel.build({
    class: classObj.id,
    subject: subjectObj.id,
    content: body.content,
    term: termObj.id,
  }).save();
};

export const getSOW = async (filter: SOWFilter) => {
  const { ...others } = filter;
  Object.keys(others).forEach((key) => {
    if (
      !others[key] &&
      !!others[key] !== false &&
      parseInt(others[key]!.toString()) !== 0
    ) {
      delete others[key];
    }
  });
  return await findSOWByFilter(filter);
};

export const editSOW = async (id: string, body: CreateSOWInput) => {
  const classObj = await ClassModel.findById(body.class);
  const subjectObj = await SubjectModel.findById(body.subject);
  const termObj = await TermModel.findById(body.term);
  const sow = await findSOWBy("_id", id);
  if (!classObj) throw new NotFoundError("Class");
  if (!subjectObj) throw new NotFoundError("Subject");
  if (!termObj) throw new NotFoundError("Term");
  if (!sow) throw new NotFoundError("Scheme of Work");
  sow.set({
    class: classObj.id,
    subject: subjectObj.id,
    content: body.content,
    term: termObj.id,
  });
  return await sow.save();
};

export const deleteSOW = async (id: string) => {
  const sow = await findSOWBy("_id", id);
  if (!sow) throw new NotFoundError("Scheme of Work");
  return await SOWModel.findOneAndDelete({ _id: id });
};
