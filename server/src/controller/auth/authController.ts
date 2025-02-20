import { Request, Response } from "express";
import User from "../../model/userModel";
import { loginSchema, registerSchema } from "../../lib/bodyValidations/auth";
import bcrypt from "bcryptjs"
const userRegister = async (req: Request, res: Response) => {
  const { username, email, password } = registerSchema.parse(req.body);
  const userNameExists = await User.findOne({ username });
  if (userNameExists){
    return res.status(400).json({ message: "Username already exists" });
  }  const emailExists = await User.findOne({ email });
  if (emailExists)
    return res.status(400).json({ message: "Email already exists" });
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  return res.status(201).json({ message: "User created", user });
};

const userLogin = async (req: Request, res: Response) => {
  const { username, email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) return res.status(400).json({ message: "User not found" });
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword){
    return res.status(400).json({ message: "Invalid Password"});
  }
  return res.status(200).json({ message: "User found", user });
};

export { userRegister, userLogin };

