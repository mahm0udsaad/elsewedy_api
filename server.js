const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'saad123mn123@gmail.com', 
      pass:'lblslwqqfvnezark',
    }
  });

app.options('/submitForm', cors());

app.post('/submitForm', (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  const mailOptions = {
    from: email, // Sender email address
    to: 'Khaledsalim@yahoo.com', // Recipient email address
    subject: 'Website Messages',
    text: `
      First Name: ${firstName}\n
      Last Name: ${lastName}\n
      Email: ${email}\n
      Message: ${message}\n
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Form data received and email sent successfully!' });
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
