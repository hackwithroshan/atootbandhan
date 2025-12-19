import nodemailer from 'nodemailer';
import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  const mailProvider = process.env.MAIL_PROVIDER?.toLowerCase();
  const from = process.env.MAIL_FROM;

  if (!from) {
    throw new Error('MAIL_FROM is not defined in environment variables.');
  }

  if (mailProvider === 'resend') {
    // --- Using Resend ---
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured for mail provider "resend".');
    }
    const resend = new Resend(resendApiKey);
    await resend.emails.send({ from, to, subject, html });
    console.log(`Email sent to ${to} via Resend`);

  } else {
    // --- Using SMTP (default) ---
    if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP configuration is incomplete. Please check your .env file.');
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: parseInt(process.env.SMTP_PORT, 10) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({ from, to, subject, html });
    console.log(`Email sent to ${to} via SMTP`);
  }
};

export default sendEmail;
