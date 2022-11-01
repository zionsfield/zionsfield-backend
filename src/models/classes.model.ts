import {
  buildSchema,
  index,
  modelOptions,
  pre,
  prop,
} from "@typegoose/typegoose";
import mongoose, { Document, Model } from "mongoose";

export type ClassAttrs = {
  className: string;
  level: number;
};

export interface ClassDoc extends Document {
  className: string;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IClassModel extends Model<ClassDoc> {
  build(attrs: ClassAttrs): ClassDoc;
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
export class Class {
  @prop({ required: true })
  public className!: string;

  @prop({ required: true })
  public level!: number;

  public static build(attrs: ClassAttrs) {
    return new ClassModel(attrs);
  }
}
const classSchema = buildSchema(Class);
const ClassModel = mongoose.model<ClassDoc, IClassModel>("Class", classSchema);

export { ClassModel };
