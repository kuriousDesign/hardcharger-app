import { NextResponse } from 'next/server'
//import { Driver } from '@/models/Driver'
//import dbConnect from '@/lib/dbConnect'
//import mongoose from 'mongoose'


export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Received JSON:', body)
        return NextResponse.json({ message: 'JSON received successfully' })
    } catch (error) {
        console.error('Error processing JSON:', error)
        return NextResponse.json({ error: 'Failed to process JSON' }, { status: 400 })
    }
}
