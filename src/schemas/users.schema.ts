import { object, string, TypeOf } from "zod";

export const signinUserSchema = object({
  body: object({
    username: string({ required_error: "Username is required" }).min(
      1,
      "Username is required"
    ),
    password: string({ required_error: "Password is required" })
      .trim()
      .min(1, "Password is required"),
  }),
});

export const changePasswordSchema = object({
  body: object({
    oldPsw: string({ required_error: "Old password is required" })
      .trim()
      .min(1, "Old password is required"),
    newPsw: string({ required_error: "New password is required" })
      .trim()
      .min(6, "New password must be at least 6 characters"),
  }),
});

export type SigninUserInput = TypeOf<typeof signinUserSchema>["body"];
export type ChangePasswordInput = TypeOf<typeof changePasswordSchema>["body"];
