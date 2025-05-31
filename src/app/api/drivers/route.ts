import { NextResponse } from 'next/server'
import { Driver } from '@/models/Driver'
import dbConnect from '@/lib/dbConnect'
import mongoose from 'mongoose'


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

export const GET = async () => {
    try {
        await dbConnect()

        if (!mongoose.connection.db) {
        throw new Error('Database connection not established')
        }
        
        const data = await Driver.find()
        //console.log('GET /api --> drivers: ', data)

        return NextResponse.json(data)
    } catch (error) {
        console.error('API GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 })
    }
}