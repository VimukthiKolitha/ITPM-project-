import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentManager.css';

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/payment/payment-list');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment({ ...payment });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:4000/api/payment/update-payment${editingPayment._id}`, editingPayment);
      setEditingPayment(null);
      fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm('Are you sure you want to delete this payment?');
    if (!confirmCancel) return;

    try {
      await axios.delete(`http://localhost:4000/api/payment/delete-appointments${id}`);
      fetchPayments();
    } catch (error) {
      console.error('Error canceling payment:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPayment((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="payment-manager-page">
      <h1>Payment Manager</h1>
      <div className="manager-container">
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id}>
                  {editingPayment && editingPayment._id === payment._id ? (
                    <>
                      <td>Rs {payment.amount}.00</td>
                      <td>
                        <select name="status" value={editingPayment.status} onChange={handleInputChange}>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>
                      <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                      <td>
                        <button className="save" onClick={handleSave}>Save</button>
                        <button className="cancel" onClick={() => setEditingPayment(null)}>Delete</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>Rs {payment.amount}.00</td>
                      <td>{payment.status}</td>
                      <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                      <td>
                        <button className="edit" onClick={() => handleEdit(payment)}>Edit</button>
                        <button className="cancel" onClick={() => handleCancel(payment._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No payment records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManager;
