import nodemailer from "nodemailer";
import { CustomError } from "./util/CustomError";
const sendMail = async (email: string, title: string, body: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      from: "scopeo team",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: "scopeo team",
      to: email,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    console.log(error);
    throw new CustomError(500, "Error when sending Email");
  }
};

export const sendRegisterOtpMail = async (email: string, otp: string) => {
  await sendMail(
    email,
    "Verify your email",
    `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f0fdf4; padding: 20px; border-radius: 8px;">
        <h2 style="color: #166534;">Welcome to Scopeo!!</h2>
        <p style="color: #065f46;">Please enter the following OTP to verify your email:</p>
        <h1 style="color: #16a34a; background: #d1fae5; display: inline-block; padding: 10px 20px; border-radius: 8px;">${otp}</h1>
        <p style="color: #064e3b;">Expires in 5 minutes</p>
    </div>
        `
  );
};
