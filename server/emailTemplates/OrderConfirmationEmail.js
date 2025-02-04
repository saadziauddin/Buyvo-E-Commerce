import React from 'react';
import { Html, Head, Preview, Body, Container, Heading, Text } from '@react-email/components';

function OrderConfirmationEmail({ orderId, userName, orderDetails }) {
  return React.createElement(
    Html,
    null,
    React.createElement(Head),
    React.createElement(Preview, null, 'Your Order Confirmation'),
    React.createElement(
      Body,
      null,
      React.createElement(
        Container,
        null,
        React.createElement(Heading, null, `Hello, ${userName}!`),
        React.createElement(Text, null, 'Thank you for your order. Here are your order details:'),
        React.createElement(Text, null, `Order ID: ${orderId}`),
        React.createElement(Text, null, `Items: ${orderDetails}`),
        React.createElement(Text, null, 'We hope you enjoy your purchase!')
      )
    )
  );
}

export default OrderConfirmationEmail;
