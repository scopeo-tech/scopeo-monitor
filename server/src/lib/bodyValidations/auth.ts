import z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).regex(
    /^[a-z0-9_]+$/,
    "Username can only contain lowercase letters, numbers, and underscores"
  ),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  googleId: z.string().optional(),
});

export const loginSchema = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string(),
    googleId: z.string().optional(),
  }).refine((data) => data.username || data.email, {
    message: "Either username or email is required",
    path: ["username", "email"], 
  });

  export const otpSchema = z.object({
    email: z.string().email(),
  });
  
  export const verifyOtpSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
  });
