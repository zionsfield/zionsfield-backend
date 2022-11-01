import {
  buildSchema,
  index,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import mongoose, { Document, Model } from "mongoose";

export type SubjectAttrs = {
  name: string;
};

export interface SubjectDoc extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ISubjectModel extends Model<SubjectDoc> {
  build(attrs: SubjectAttrs): SubjectDoc;
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
export class Subject {
  @prop({ required: true })
  public name!: string;

  public static build(attrs: SubjectAttrs) {
    return new SubjectModel(attrs);
  }
}
const subjectSchema = buildSchema(Subject);
const SubjectModel = mongoose.model<SubjectDoc, ISubjectModel>(
  "Subject",
  subjectSchema
);

export { SubjectModel };
