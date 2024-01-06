const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

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
    to: 'info@elsewedy-automation.com', // Recipient email address
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
const analyticsDataClient = new BetaAnalyticsDataClient();
const propertyId = '313683933';

app.get('/api/analytics', async (req, res) => {
  
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2020-03-31',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'city',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    const reportData = response.rows.map(row => ({
      city: row.dimensionValues[0],
      activeUsers: row.metricValues[0],
    }));
    console.log(reportData);
    res.status(200).json({ reportData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
