import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/usermodel.js';
import { sendSms } from '../services/melipayamakService.js';
import { generateToken, isAuth, isAdmin } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.number = req.body.number || user.number;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        number: updatedUser.number,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.post(
  '/request-temporary-token',
  expressAsyncHandler(async (req, res) => {
    // normalize incoming number to digits-only then number type
    const rawNumber = String(req.body.number || '');
    const numberDigits = Number(rawNumber.replace(/[^0-9]/g, ''));
    const user = await User.findOne({ number: numberDigits });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // generate a short numeric OTP (6 digits) and expiry (3 minutes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.temporaryOtp = otp;
    user.temporaryOtpExpires = new Date(Date.now() + 3 * 60 * 1000);
    // clear any legacy temporaryToken
    user.temporaryToken = null;
    await user.save();

    try {
      let toNumber = String(user.number);
      if (/^0/.test(toNumber)) {
        toNumber = '+98' + toNumber.substring(1);
      }
      const smsText = `کد موقت: ${otp} (اعتبار: 3 دقیقه)`;
      await sendSms(toNumber, smsText);
      console.log('Sent OTP SMS to', toNumber);
    } catch (smsErr) {
      console.error(
        'Failed to send OTP SMS:',
        smsErr && smsErr.message ? smsErr.message : smsErr
      );
    }

    res.send({
      message: 'OTP sent to the provided phone number if it exists.',
    });
  })
); 

// Verify OTP and reset password in a single request
userRouter.post(
  '/verify-otp',
  expressAsyncHandler(async (req, res) => {
    const { number, otp, password } = req.body;
    if (!number || !otp || !password) {
      return res
        .status(400)
        .send({ message: 'number, otp and password are required' });
    }

    const numberDigits = Number(String(number).replace(/[^0-9]/g, ''));
    const user = await User.findOne({ number: numberDigits });
    if (!user) return res.status(404).send({ message: 'User not found' });

    if (!user.temporaryOtp || user.temporaryOtp !== String(otp)) {
      return res.status(400).send({ message: 'Invalid OTP' });
    }

    if (
      !user.temporaryOtpExpires ||
      new Date(user.temporaryOtpExpires) < new Date()
    ) {
      return res.status(400).send({ message: 'OTP expired' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .send({ message: 'Password must be at least 8 characters' });
    }

    user.password = bcrypt.hashSync(password, 8);
    user.temporaryOtp = null;
    user.temporaryOtpExpires = null;
    await user.save();

    // return an authentication token so the user is logged in after reset
    res.send({
      message: 'Password reset successfully',
      token: generateToken(user),
    });
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.deleteOne();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ number: req.body.number });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          number: user.number,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      } else {
        res.status(401).send({ message: 'Invalid password' });
        return;
      }
    }
    res.status(401).send({ message: 'شماره پیدا نشد' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      number: req.body.number,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      number: user.number,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

export default userRouter;
