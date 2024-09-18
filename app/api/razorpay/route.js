import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import Payment from '@/models/Payment';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';

export const POST = async (req) => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/GetMeVadapav');
        }

        const body = await req.json();

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
            // Save the payment record to the database
            await Payment.create({
                name: body.name, // Extract from the request body
                to_user: body.to_user, // Extract from the request body
                oid: body.razorpay_order_id,
                message: body.message, // Extract from the request body
                amount: body.amount, // Extract from the request body
                done: true, // Mark the payment as complete
            });

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
