import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate ,useLocation} from 'react-router-dom';
import './PaymentForm.css';



const PaymentForm = () => {
  const location = useLocation();
  const { appointmentId, amount } = location.state || {};
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    amount: amount || '',
  });

  const navigate = useNavigate();

  const validateCardNumber = (number) => {
    return /^\d{16}$/.test(number); // Ensures 16-digit numeric input
  };

  const validateExpiryDate = (date) => {
    return /^(0[1-9]|1[0-2])\/(\d{2})$/.test(date); // MM/YY format
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv); // 3 or 4 digits
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCardNumber(formData.cardNumber)) {
      alert('Invalid card number. Must be 16 digits.');
      return;
    }
    if (!validateExpiryDate(formData.expiryDate)) {
      alert('Invalid expiry date. Use MM/YY format.');
      return;
    }
    if (!validateCVV(formData.cvv)) {
      alert('Invalid CVV. Must be 3 or 4 digits.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/payment/payment', formData);
      alert('Payment Successful!');
      console.log(response.data);
      setFormData({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        amount: '',
      });
    } catch (error) {
      alert('Payment Failed!');
      console.error(error);
    }
  };

  return (
    <div className="payment-form-page">
      <h1>Payment Gateway</h1>
      <div className="form-container">
        <h2>Make a Payment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cardHolder"
            placeholder="Card Holder"
            value={formData.cardHolder}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="expiryDate"
            placeholder="Expiry Date (MM/YY)"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={formData.cvv}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value= {formData.amount}
            onChange={handleChange}
            required
            disabled
          />
          <button type="submit">Pay Now</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
