'use server';
import { sendEmail } from "@/lib/mail";
import { render } from "@react-email/render";
import OTPEmailTemplate from "@/components/mails/OTP";
import WelcomeEmail from "@/components/mails/Welcome";
import OrderDetailsEmail from "@/components/mails/OrderConfirmation";
import ServiceRequest from "@/components/mails/ServiceRequest";

export const handleSendEmail = async ({ email }) => {
  const response = await sendEmail({ to: email, subject: 'Testing Mails', html: '<h1>Hello Everynyan</h1>' });
  console.log(response);
};

export const sendOTPEmail = async ({ email, otp }) => {
  const emailHtml = await render(<OTPEmailTemplate validationCode={otp} />);
  await sendEmail({
    to: email,
    subject: 'Email Verification',
    html: emailHtml,
  });
}

export const sendWelcomeEmail = async ({ email, username }) => {
  const emailHtml = await render(<WelcomeEmail username={username} />);
  await sendEmail({
    to: email,
    subject: 'Welcome to Link My Logistics',
    html: emailHtml,
  });
}

export const sendOrderDetailsEmail = async ({ email, order }) => {
  const emailHtml = await render(<OrderDetailsEmail order={order} />);
  await sendEmail({
    to: email,
    subject: 'Order Details',
    html: emailHtml,
  });
}

export const sendServiceRequestEmail = async ({ email, request, service }) => {
  const emailHtml = await render(<ServiceRequest request={request} service={service} />);
  await sendEmail({
    to: email,
    subject: 'Request Submitted Successfully',
    html: emailHtml,
  });
}
