import * as argon from "argon2";
import jwt from "jsonwebtoken";
import { Role } from "../enums";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { UserPayload } from "../middlewares/current-user";
import { UserModel } from "../models/users.model";
import { ChangePasswordInput, SigninUserInput } from "../schemas/users.schema";

export const findUserBy = async (by: string, value: any) => {
  return await UserModel.findOne({
    [by]: value,
  });
};

export const findUserByFilter = async (filter: any) => {
  return await UserModel.findOne(filter);
};

/* Services */
export const signToken = (user: UserPayload) => {
  const userJwt = jwt.sign(
    { id: user.id, email: user.email, role: user.role, term: user.term },
    process.env.JWT_KEY!
  );
  return userJwt;
};

export const signin = async (
  { username, password }: SigninUserInput,
  role: Role
) => {
  let user: any;
  if (role === Role.TEACHER) {
    user = await findUserByFilter({ username, role: Role.TEACHER });
  } else if (role === Role.STUDENT) {
    user = await findUserByFilter({ username, role: Role.STUDENT });
  }
  if (!user) throw new BadRequestError("Credentials Incorrect");
  const passwordsMatch = await argon.verify(user.password, password);

  if (!passwordsMatch) throw new BadRequestError("Credentials Incorrect");
  const access_token = signToken({
    email: user.email,
    id: user._id,
    role: user.role,
    term: user.term,
  });
  return { access_token, user };
};

export const changePassword = async (
  { oldPsw, newPsw }: ChangePasswordInput,
  userId: string,
  role: Role
) => {
  let user: any;
  if (role === Role.TEACHER) {
    user = await findUserByFilter({ _id: userId, role: Role.TEACHER });
  } else {
    user = await findUserByFilter({ _id: userId, role: Role.STUDENT });
  }
  if (!user) throw new NotFoundError("User");
  const passwordsMatch = await argon.verify(user.password, oldPsw);
  if (!passwordsMatch) throw new BadRequestError("Password Incorrect");
  user.set({
    password: newPsw,
  });
  await user.save();
  return {};
};
