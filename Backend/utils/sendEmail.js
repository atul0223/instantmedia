import nodemailer from 'nodemailer'
const sendVerificationEmail = async (email, token,subject,message,routee) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  const url = `${process.env.FRONTENDURL}/${routee}?token=${token}`;

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${subject || 'Email Verification'}`,
    html: `<p>Click <a href="${url}">here</a> to ${message}.</p>`,
  });
}
export default sendVerificationEmail