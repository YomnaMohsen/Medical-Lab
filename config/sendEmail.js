import nodemailer from 'nodemailer';


const sendEmail = async (recipientEmail, visitDate) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const emailContent = `
            <h1>Home Visit Confirmation</h1>
            <p>Dear Patient,</p>
            <p>Your home visit has been scheduled for:</p>
            <p><strong>${visitDate}</strong></p>
            <p>Thank you for choosing our services!</p>
        `;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: "Home Confirmation Visit",
        html: emailContent,
    };

    await transporter.sendMail(mailOptions);


}


export default sendEmail;