const transporter = require('../config/transporter');
const fs = require('fs');
const path = require('path');

async function sendEmail(recipient, deviceInfo) {
    const imagePath = path.join(__dirname, '../../stock.jpg'); // Update with the path to your local image
    const imageBase64 = fs.readFileSync(imagePath).toString('base64');
    const imageCid = 'logsense-logo@yourdomain.com'; // Unique identifier for the image

    const subject = `${deviceInfo.DeviceName} ${deviceInfo.Action} Alert`;
    const body = `
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; text-align: center; padding: 20px;">
        <div style="display: inline-block; background: #fff; padding: 20px; border: 1px solid #ccc; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <img src="cid:${imageCid}" alt="Logsense" style="width: 150px; margin-bottom: 20px;">
            <h2 style="color: #4CAF50;">Device Alert Notification</h2>
            <p style="font-size: 16px;">Your account <strong>${deviceInfo.DeviceId}</strong> has performed an action: <strong>${deviceInfo.Action}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Device Name</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${deviceInfo.DeviceName}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Device ID</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${deviceInfo.DeviceId}</td>
                </tr>
                <tr style="background: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Action</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${deviceInfo.Action}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; text-align: left;">MAC ID</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${deviceInfo.MacId}</td>
                </tr>
                <tr style="background: #f2f2f2;">
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; text-align: left;">Time of Activity</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: left;">${deviceInfo.TimeofActivity}</td>
                </tr>
            </table>
            <p style="font-size: 14px;">If this is not you, please <a href="#" style="color: #4CAF50;">You can Trigger the Trigger Relay</a> immediately.</p>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        html: body,
        attachments: [{
            filename: 'stock.jpg',
            path: imagePath,
            cid: imageCid // Same CID value as in the html img src
        }]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipient} for ${deviceInfo.DeviceName}`);
    } catch (error) {
        console.error(`Error sending email to ${recipient}: ${error}`);
    }
}

module.exports = { sendEmail };
