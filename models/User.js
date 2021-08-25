import mongoose from 'mongoose';

/** @type { import('mongoose').Schema<import('../declarations').UserDocument, import('../declarations').UserModel>} */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  createdTime: {
    type: Date,
    default: Date.now(),
  },
});

/** @type {import('../declarations').UserModel} */
const User = mongoose.model('User', UserSchema);

export default User;
