//rate limiting - limiting the number of requests a user can make to a server
//can be done at application level or at loadbalancer level
//can be done by using  user id or ip address


//ddos attack - overwhelming a withflood of traffic and make it unavailable for real users . 
// ddos protection mechanism are used to filter out malacious traffic by using captchas


import express from "express"
import {rateLimit} from "express-rate-limit"

const app = express()
const PORT = 3000;

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,  //15 minutes
//   limit:100, 
//   message: "Too many requests, please try again after 15 minutes",
//   standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// })

app.use(express.json());
// app.use(limiter);    //apply rate limiting middleware to rate limit all requests


const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  
  limit:3,  
  message: "Too many requests, please try again after 5 minutes",
  standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const passwordResetLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  
  limit:5,  
  message: "Too many requests, please try again after 5 minutes",
  standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


const otpStore: Record<string, string> = {};

//this end point is not rate limited
app.post('/generate-otp', otpLimiter, (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  // const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = otp;

  console.log(`OTP for ${email}: ${otp}`); 
  res.status(200).json({ message: "OTP generated and logged" });
});


//this end point is not rate limited
app.post('/reset-password', passwordResetLimiter, (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }
  if (otpStore[email] === otp) {
    console.log(`Password for ${email} has been reset to: ${newPassword}`);
    delete otpStore[email]; 
    res.status(200).json({ message: "Password has been reset successfully" });
  } else {
    res.status(401).json({ message: "Invalid OTP" });
  }
});


app.listen(PORT , () => {
    console.log("Server running on port 3000")
})