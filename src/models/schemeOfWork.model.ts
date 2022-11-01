import {
  buildSchema,
  index,
  modelOptions,
  pre,
  prop,
  Ref,
} from "@typegoose/typegoose";
import mongoose, { Document, Model } from "mongoose";
import { CreateSOWInput } from "../schemas/schemeOfWork.schema";
import { Class, ClassDoc } from "./classes.model";
import { Subject, SubjectDoc } from "./subject.model";
import { Term, TermDoc } from "./terms.model";

export type SOWAttrs = CreateSOWInput & {
  term: string;
};

export interface SOWDoc extends Document {
  subject: SubjectDoc;
  class: ClassDoc;
  term: TermDoc;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ISOWModel extends Model<SOWDoc> {
  build(attrs: SOWAttrs): SOWDoc;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
})
export class SchemeOfWork {
  @prop({ required: true })
  public content!: string;

  @prop({ required: true, ref: "Term" })
  public term!: Ref<Term>;

  @prop({ required: true, ref: "Subject" })
  public subject!: Ref<Subject>;

  @prop({ required: true, ref: "Class" })
  public class!: Ref<Class>;

  public static build(attrs: SOWAttrs) {
    return new SOWModel(attrs);
  }
}
const sowSchema = buildSchema(SchemeOfWork);
const SOWModel = mongoose.model<SOWDoc, ISOWModel>("SchemeOfWork", sowSchema);

export { SOWModel };
