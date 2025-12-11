import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    addresses: [
      {
        addressName: { type: String, required: true },
        fullName: { type: String, required: true },
        nationalCode: { type: Number, required: true },
        province: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        postalCode: { type: String, required: true },
      },
    ],
    temporaryToken: { type: String },
    temporaryOtp: { type: String },
    temporaryOtpExpires: { type: Date },
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
