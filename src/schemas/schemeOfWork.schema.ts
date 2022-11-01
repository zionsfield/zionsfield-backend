import { object, string, TypeOf } from "zod";

export const createSOWSchema = object({
  body: object({
    class: string({ required_error: "Class is required" }),
    subject: string({ required_error: "Subject is required" }),
    content: string({ required_error: "Content is required" }),
  }),
});

export type CreateSOWInput = TypeOf<typeof createSOWSchema>["body"];
