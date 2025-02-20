import { NextFunction, Request, Response } from "express";
import User from "../../model/userModel";
import { loginSchema, registerSchema } from "../../lib/bodyValidations/auth";
import bcrypt from "bcryptjs"
import { CustomError } from "../../lib/util/CustomError";
import { createAccessToken } from "../../lib/jwt";
const userRegister = async (req: Request, res: Response , next: NextFunction)  => {
  const { username, email, password } = registerSchema.parse(req.body);
  const userNameExists = await User.findOne({ username });
  if (userNameExists){
    throw new CustomError(400, "Username already exists");
  }  const emailExists = await User.findOne({ email });
  if (emailExists)
    throw new CustomError(400, "Email already exists");
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  return res.status(201).json({ status : "success", message: "User created successfully", });
};

const userLogin = async (req: Request, res: Response) => {
  const { username, email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user){
    throw new CustomError(400, "User not found");
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword){
    throw new CustomError(400, "Invalid password");
  }
  const token = createAccessToken(user._id.toString(), process.env.JWT_TOKEN as string);
  return res.status(200).json({status: "success", message: "User", user });
};

export { userRegister, userLogin };

