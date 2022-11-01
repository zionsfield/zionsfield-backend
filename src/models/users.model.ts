import {
  buildSchema,
  index,
  modelOptions,
  pre,
  prop,
  Ref,
} from "@typegoose/typegoose";
import mongoose, { Document, Model } from "mongoose";
import * as argon from "argon2";
import { Role } from "../enums";

export type UserAttrs = {
  username: string;
  password: string;
  name: string;
  role: Role;
};

interface UserDoc extends Document {
  name: string;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserModel extends Model<UserDoc> {
  build(user: UserAttrs): UserDoc;
}

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hash = await argon.hash(this.password);
  this.password = hash;
  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
})
export class User {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: true, enum: Object.values(Role) })
  public role!: string;

  public static build(user: UserAttrs) {
    return new UserModel(user);
  }
}
const userSchema = buildSchema(User);
const UserModel = mongoose.model<UserDoc, IUserModel>("User", userSchema);

export { UserModel };
