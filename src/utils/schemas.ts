import { object, string } from "zod";

export const idSchema = object({
  params: object({
    id: string({ required_error: "Id is required" }),
  }),
});
