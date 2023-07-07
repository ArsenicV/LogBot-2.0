const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

let intervalId;

app.use(express.json());

// Configure Nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'your_email_service', // e.g., 'gmail'
  auth: {
    user: 'your_email_address', //put ur email
    pass: 'your_email_password', //put ur pwd
  },
});

// Send email
function sendEmail(toEmail) {
  const mailOptions = {
    from: 'abc@gmail.com',
    to: toEmail,
    subject: 'LogBot 2.0 attachment',
    text: 'Your message',
    attachments: [
      {
        filename: 'Record.txt',
        content: 'Attachment content',
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Start sending emails periodically
function startSendingEmails(email, timePeriod) {
  intervalId = setInterval(() => {
    sendEmail(email);
  }, timePeriod * 60 * 60 * 1000);
  console.log(`Email sending started every ${timePeriod} hour(s).`);
}

// Stop sending emails
function stopSendingEmails() {
  clearInterval(intervalId);
  console.log('Email sending stopped.');
}

app.post('/start', (req, res) => {
  const { email, timePeriod } = req.body;
  startSendingEmails(email, timePeriod);
  res.send('Email sending started.');
});

app.post('/stop', (req, res) => {
  stopSendingEmails();
  res.send('Email sending stopped.');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
