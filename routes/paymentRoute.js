import express from 'express';
import { createPayment, updatePayment, cancelPayment, getAllPayments } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/payment', createPayment);
router.put('/update-payment:id', updatePayment);
router.delete('/delete-appointments:id', cancelPayment);
router.get('/payment-list', getAllPayments);

export default router;
