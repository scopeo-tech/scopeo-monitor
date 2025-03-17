import nodemailer from 'nodemailer';
import CustomError from '../lib/util/CustomError';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport ({
 service :"Gmail",
    auth: {
        user:process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_EMAIL_PASSWORD
    
    }})

export const sendEmail = async (firstName:string,lastName:string , email: string, message: string ,body: string) => {
    try {
        await transporter.sendMail({
            from: email, 
            to: process.env.ADMIN_EMAIL, 
            subject: `New Contact Request from ${firstName} ${lastName}`,
            text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: body,
        });
    } catch (error) {
        console.log(error);
        throw new CustomError(500, "Error when sending Email");
    }
}

export const sendContactEmail = async (firstName:string,lastName:string , email: string, message: string) => {
    const body = `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f0fdf4; padding: 20px; border-radius: 8px;">
        <h2 style="color: #166534;">New Contact Request</h2>
        <p style="color: #065f46;">Name: ${firstName} ${lastName}</p>
        <p style="color: #065f46;">Email: ${email}</p>
        <p style="color: #065f46;">Message: ${message}</p>
    </div>
    `;
    await sendEmail(firstName, lastName,email, message, body);
}