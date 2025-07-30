import { MAIL_AUTH_PASS, MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER } from '@/constants/mail';
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_SECURE,
  auth: {
    user: MAIL_USER,
    pass: MAIL_AUTH_PASS,
  },
});

/**
 * Send email using NodeMailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @returns {Promise} - Resolves with info about sent email
 */

export const sendEmail = async ({ to, subject, html }) => {
  try {
    // Check for missing required fields
    if (!to || !subject || !html) {
      throw new Error('Missing required fields: to, subject, or html');
    }

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: MAIL_USER,
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error(error.message || 'Error sending email');
  }
};
