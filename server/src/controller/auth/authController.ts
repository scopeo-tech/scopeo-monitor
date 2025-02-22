import { NextFunction, Request, Response } from "express";
import User from "../../model/userModel";
import {
  loginSchema,
  otpSchema,
  registerSchema,
  verifyOtpSchema,
} from "../../lib/bodyValidations/auth";
import bcrypt from "bcryptjs";
import CustomError from "../../lib/util/CustomError";
import { createAccessToken, createRefreshToken } from "../../lib/jwt";
import jwt from "jsonwebtoken";
import { sendRegisterOtpMail } from "../../lib/sendMail";
import otpGenerator from "otp-generator";
import Otp from "../../model/otpModel";
import { OAuth2Client } from "google-auth-library";

export const sendOtpForRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = otpSchema.parse(req.params);

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return next(new CustomError(400, "Email already exists"));
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const expiresAt = new Date(Date.now() + 1000 * 60 * 5);

  await Otp.findOneAndDelete({ email });
  await Otp.create({ email, otp, expiresAt });

  await sendRegisterOtpMail(email, otp);

  res.status(200).json({
    status: "success",
    message: "OTP sent successfully",
  });
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, otp } = verifyOtpSchema.parse(req.body);

  const otpDoc = await Otp.findOne({ email });

  if (!otpDoc) {
    return next(new CustomError(400, "OTP not found"));
  }
  if (otpDoc.verified) {
    return next(new CustomError(400, "OTP already verified"));
  }
  if (otpDoc.expiresAt < new Date()) {
    return next(new CustomError(400, "OTP expired"));
  }
  if (otpDoc.otp !== otp) {
    return next(new CustomError(400, "OTP is incorrect"));
  }

  await otpDoc.updateOne({ verified: true });

  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
  });
};

const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = registerSchema.parse(req.body);
  const userNameExists = await User.findOne({ username });
  if (userNameExists) {
    return next(new CustomError(400, "Username already exists"));
  }  
  
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return next(new CustomError(400, "Email already exists"));
  }
  
  const otpVerified = await Otp.findOne({ email, verified: true });
  if (!otpVerified) {
    return next (new CustomError(400,"Email not verified"));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({
    username,
    email,
    password: hashedPassword,
  });
  await Otp.findOneAndDelete({ email });
  return res
    .status(201)
    .json({ status: "success", message: "User created successfully" });
};

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = loginSchema.parse(req.body);
  
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) return next(new CustomError(400, "User not found"));
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return next(new CustomError(400, "Invalid password"));

  const token = createAccessToken(user._id.toString(), process.env.JWT_TOKEN as string);
  const refreshToken = createRefreshToken(user._id.toString(), process.env.JWT_REFRESH_TOKEN as string);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  const currUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
  return res
    .status(200)
    .json({
      status: "success",
      message: "User logged successfully",
      user: currUser,
      token,
    });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req: Request, res: Response) => {
  const { idToken } = req.body;
console.log(idToken)
  if (!idToken) return res.status(400).json({ error: "ID token missing" });

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: "Invalid token" });

    const token = jwt.sign(
      {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
      },
      process.env.JWT_TOKEN!,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user: payload });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};




const userLogout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logout successful" });
};

const refreshingToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new CustomError(401, "No refresh token provided"));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as string) as { _id: string };
    if (!decoded || !decoded._id) {
      return next(new CustomError(403, "Invalid refresh token"));
    }
    const accessToken = createAccessToken(decoded._id, process.env.JWT_TOKEN as string);
    
    res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      token: accessToken,
    });
  } catch (error) {
    return next(new CustomError(403, "Invalid or expired refresh token"));
  }
};

export { userRegister, userLogin, userLogout, refreshingToken , googleLogin };
