import nodemailer from "nodemailer";



  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  export const sendEmail = async(to, subject, html) =>{
    const send = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });



  console.log('Email sent successfully to:', send)
};

