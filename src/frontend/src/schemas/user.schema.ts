import * as z from "zod";
import Roles from "../types/users/user";
export enum Role {
  Developer = "developer",
  Recruiter = "recruiter",
}
export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .refine(
      (value) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          value
        ),
      {
        message:
          "Password must contain at least one letter, one number, and one special character",
      }
    ),
});

export const signupSchema = z
  .object({
    firstName: z.string({
      required_error: "First name is required",
    }),
    lastName: z.string({
      required_error: "Last name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    phone: z.string({
      required_error: "Phone number is required",
    }),
    role: z.nativeEnum(Role, {
      required_error: "Role is required",
    }),
  })
  .merge(loginSchema);

export type ICreateUser = z.infer<typeof signupSchema>;
export type IUser = ICreateUser & {
  id: string;
};

export type ISignIn = z.infer<typeof loginSchema>;
