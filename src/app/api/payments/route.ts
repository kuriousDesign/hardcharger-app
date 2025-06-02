import { NextResponse } from 'next/server'
import { Payment, PaymentType } from '@/models/Payment'
import dbConnect from '@/lib/dbConnect'
import mongoose from 'mongoose'
import { postPayment } from '@/actions/action'


export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Received JSON:', data)

    // Call postPayment, but don't await and don't let it throw
    postPayment(data as PaymentType).catch(err => {
      console.error('⚠️ postPayment failed:', err)
    })

    // Always respond successfully to the client
    return NextResponse.json({ message: 'payment received successfully' })
  } catch (error) {
    console.error('Error processing JSON:', error)
    return NextResponse.json({ error: 'Failed to process JSON' }, { status: 400 })
  }
}

export const GET = async () => {
    try {
        await dbConnect()

        if (!mongoose.connection.db) {
            throw new Error('Database connection not established')
        }
        
        const data = await Payment.find()
        //console.log('GET /api --> drivers: ', data)

        return NextResponse.json(data)
    } catch (error) {
        console.error('API GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
    }
}