import { NextResponse } from 'next/server'
import { PaymentModel as Payment, PaymentClientType } from '@/models/Payment'
import dbConnect from '@/lib/dbConnect'
import mongoose from 'mongoose'
import { postPayment } from '@/actions/postActions'


export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Received JSON:', data);

    // Call postPayment, but don't await and don't let it throw
    let errMsg = '';
    let postSuccess = true;
    await postPayment(data as PaymentClientType).catch(err => {
        console.error('⚠️ postPayment failed:', err);
        postSuccess = false;
        errMsg = (err as Error).message || 'Unknown error';
    })

    // Always respond successfully to the client
    if (!postSuccess) {
      console.error('⚠️ postPayment did not succeed:', errMsg);
      return NextResponse.json(
          { error: 'Failed to process payment', details: errMsg },
          { status: 500 }
      );
    }
    return NextResponse.json({ message: 'payment received and stored' })
  } catch (error) {
    console.error('Error processing JSON:', error);
    return NextResponse.json(
        { error: 'Failed to process JSON', details: (error as Error).message },
        { status: 400 }
    );
  }
}

export const GET = async () => {
    try {
        await dbConnect()

        if (!mongoose.connection.db) {
            throw new Error('Database connection not established');
        }
        
        const data = await Payment.find();
        //console.log('GET /api --> drivers: ', data)

        return NextResponse.json(data);
    } catch (error) {
        console.error('API GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}