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

  export const sendEmail = async(to, subject) =>{
    const send = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: `<h1> Welcome to Ghana Eats Platform</h1>.
    <p> We are pleased to have you onboard on our site<p>`
  });



  console.log('Email sent successfully to:', send)
};

