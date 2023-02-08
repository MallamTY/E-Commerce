import nodemailer from 'nodemailer';
import { MAIL_USERNAME, MAIL_PASSWORD,
    OAUTH_CLIENTID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN 
} from '../accessories/configuration';


export const sendEmail = async(email: string, otp: string) =>  {
    
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
    to: email,
    subject: `Login one-time password `,
    text: `Your one-time-password to log in to MallamTY eCommerce API is ${otp}`,
}

return await transporter.sendMail(mailOptions)
.catch((error) => new Error("Unable to send otp"));
}