import { Resend } from 'resend';
import { render } from '@react-email/render';
import OrderConfirmationEmail from '../emailTemplates/OrderConfirmationEmail.js';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOrderConfirmationEmail = async (userEmail, userName, orderId, orderDetails) => {
  try {
    const stringifiedOrderDetails = JSON.stringify(orderDetails, null, 2);

    const htmlContent = await render(
      OrderConfirmationEmail({ orderId, userName, orderDetails: stringifiedOrderDetails })
    );

    console.log("Rendered HTML Content:", htmlContent);
    console.log("HTML Content Type:", typeof htmlContent);

    const response = await resend.emails.send({
      from: 'no-reply@nayabfashion.com.pk',
      to: [userEmail],
      subject: 'Order Confirmation',
      html: htmlContent,
    });
    console.log('Resend Response:', response);

    if (response.error) {
      console.error('Resend API Error:', response.error);
    } else {
      console.log('Email sent successfully:', response);
    }

  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

export default sendOrderConfirmationEmail;
