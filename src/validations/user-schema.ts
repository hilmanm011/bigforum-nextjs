import z from "zod";

export const userSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string(),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Invalid email" }),
});

export type UserInput = z.infer<typeof userSchema> & { id?: string };
