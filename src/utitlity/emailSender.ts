import nodemailer from 'nodemailer';
import { MAIL_USERNAME, MAIL_PASSWORD,
    OAUTH_CLIENTID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN 
} from '../accessories/configuration';
import { generateOTP } from './otp';



export const sendEmail = async(to: string,
    subject: string, text: string
    ) =>  {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: MAIL_USERNAME,
                pass: MAIL_PASSWORD,
                clientId: OAUTH_CLIENTID,
                clientSecret: OAUTH_CLIENT_SECRET,
                refreshToken: OAUTH_REFRESH_TOKEN
            }
            });
            
            const mailOptions = { 
                from: `aderogbalilian@gmail.com`,
                to,
                subject,
                text,
            }
            
            return await transporter.sendMail(mailOptions)
            .catch((error) => new Error("Unable to send otp"));
}


export const sendOTP = async(to: string, username: string) => {
    const otp: string = generateOTP(10)
    const email: string = to;
    const text: string = `Dear ${username},
    Your one-time-password to login to MallamTY eCommerce is: ${otp}`;
    const subject: string = 'Login Oone-Time-Password';

    await sendEmail(email, subject, text);
}


export const sendVerificationLink = async(to: string, username: string, token: string | undefined) => {
    const verificationEmailUrl = `http://localhost:7000/ecommerce/v1/auth/verify-email/${token}`;
    const subject: string = 'Verification Link';
    const text: string = `Dear ${username},
    To verify your email, click on this link: ${verificationEmailUrl}
    Please ignore this email if you didn't signup on MallamTY eCommerce recently`;

    await sendEmail(to,subject, text)
}