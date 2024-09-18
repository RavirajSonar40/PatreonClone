// pages/api/razorpay/verify.js
import mongoose from 'mongoose';
import Payment from '@/models/Payment'; // Ensure this path is correct based on your project structure
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    try {
        const body = await req.json();

        // Retrieve the payment record from the database
        const payment = await Payment.findOne({ oid: body.razorpay_order_id });
        if (!payment) {
            return NextResponse.json({ success: false, message: 'Order ID not found' });
        }

        // Verify the payment
        const isVerified = validatePaymentVerification(
            {
                order_id: body.razorpay_order_id,
                payment_id: body.razorpay_payment_id,
            },
            body.razorpay_signature,
            process.env.RAZORPAY_SECRET
        );

        if (isVerified) {
            // Update the payment record
            const updatedPayment = await Payment.findOneAndUpdate(
                { oid: body.razorpay_order_id },
                {
                    done: true, // Mark the payment as complete
                    updatedAt: Date.now(), // Update the timestamp
                },
                { new: true }
            );

            // Redirect the user or return a success response
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/dashboard?paymentdone=true`);
        } else {
            return NextResponse.json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' });
    }
};
