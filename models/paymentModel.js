import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const PaymentSchema = new mongoose.Schema({
  paymentDetails: { type: String, required: true }, // Hashed payment details
  amount: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Failed'] },
  paymentDate: { type: Date, default: Date.now } // Auto-generate date & time
});

// Hash payment details before saving
PaymentSchema.pre('save', async function (next) {
  if (!this.isModified('paymentDetails')) return next();
  const salt = await bcrypt.genSalt(10);
  this.paymentDetails = await bcrypt.hash(this.paymentDetails, salt);
  next();
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
