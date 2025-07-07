import nodemailer from 'nodemailer'
import User from '../modles/user.model.js';
const sendOtp = async (email) => {
    const otp =Math.floor(100000 + Math.random() * 900000);
   
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });
 await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'verification',
    html: `<p>your otp for verification is:${otp} /n This otp expires in 10 minuts.</p>`,
  });
   await User.findOneAndUpdate({email},{
      $set:{
        otp:otp
      }
    })
}
export default sendOtp