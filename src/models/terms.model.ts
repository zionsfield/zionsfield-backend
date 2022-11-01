import { buildSchema, modelOptions, prop } from "@typegoose/typegoose";
import mongoose, { Document, Model } from "mongoose";

export type TermAttrs = {
  startYear: number;
  endYear: number;
  term: number;
};

export interface TermDoc extends Document {
  startYear: number;
  endYear: number;
  term: number;
}

interface ITermModel extends Model<TermDoc> {
  build(user: TermAttrs): TermDoc;
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
export class Term {
  @prop({ required: true })
  public startYear!: number;

  @prop({ required: true })
  public endYear!: number;

  @prop({ required: true })
  public term!: number;

  public static build(term: TermAttrs) {
    return new TermModel(term);
  }
}

const termSchema = buildSchema(Term);
const TermModel = mongoose.model<TermDoc, ITermModel>("Term", termSchema);
export { TermModel };
