import nodemailer from 'nodemailer';
import { MAIL_USERNAME, MAIL_PASSWORD,
    OAUTH_CLIENTID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN 
} from '../accessories/configuration';
import { generateOTP } from './otp';



export const sendEmail = async(to: string,
    subject: string, html: string
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
                from: `MallamTY E-Commerce aderogbalilian@gmail.com`,
                to,
                subject,
                html,
            }
            
            return await transporter.sendMail(mailOptions)
            .catch((error) => new Error("Unable to send otp"));
}


export const sendOTP = async(to: string, username: string, otp: string) => {
    const token: string = otp
    const email: string = to;
    const html: string = `Dear ${username},
    Your one-time-password to login to MallamTY eCommerce is: <h1> ${token} </h1>`;
    const subject: string = 'Login One-Time-Password';

    await sendEmail(email, subject, html);
}


export const sendVerificationLink = async(to: string, username: string, token: string | undefined) => {
    const url = `http://localhost:7000/ecommerce/v1/auth/verify-email/${token}`;
    const subject: string = 'Verification Link';
    const html: string = `Dear ${username},
    To verify your email, click on this link: <a href = '${url}'>${url}</a>
    Please ignore this email if you didn't signup on MallamTY eCommerce recently`;

    await sendEmail(to,subject, html)
}