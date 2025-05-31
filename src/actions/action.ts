'use server'

import dbConnect from '@/lib/dbConnect';
import { Driver, DriverType } from '@/models/Driver'
import Event from '@/models/Event';
import { Payment, PaymentType } from '@/models/Payment';


// const addPost = async post => {
// 	const title = post.get('title')
// 	const description = post.get('description')

// 	const newPost = new Post({ title, description })
// 	return newPost.save()
// }

export const connectToDatabase = async () => {
  await dbConnect();    
  //console.log("Database connected");
  // You can add any additional setup here if needed
}

export const getDrivers = async () => {
	await dbConnect();
	const data = await Driver.find();
	//console.log("getDrivers(): ",drivers);
	return data;
}

export const getEvents = async () => {
	await dbConnect();
	const data = await Event.find();
	//console.log("getDrivers(): ",drivers);
	return data;
}

export const postDriver = async (driver: Partial<DriverType> & { _id?: string }) => {
  await dbConnect();

  const driverData = {
    first_name: driver.first_name?.trim() || '',
    last_name: driver.last_name?.trim() || '',
    suffix: driver.suffix?.trim() || '',
    car_number: driver.car_number?.trim() || '',
  };

  try {
    if (driver._id) {
      await Driver.findByIdAndUpdate(driver._id, driverData, { new: true });
      return { message: 'Driver updated successfully' };
    } else {
      const newDriver = new Driver(driverData);
      await newDriver.save();
      return { message: 'Driver created successfully' };
    }
  } catch (error) {
    console.error('Driver save error:', error);
    throw new Error('Failed to save driver');
  }
};

export const postPayment = async (payment: Partial<PaymentType> & { _id?: string }) => {
  await dbConnect();

  const paymentData = {
    amount: payment.amount,
    type: payment.type?.trim() || '',
    name: payment.name?.trim() || '',
    transaction_id: payment.transaction_id?.trim() || '',
  };

  try {
    if (payment._id) {
      await Payment.findByIdAndUpdate(payment._id, paymentData, { new: true });
      return { message: 'Payment updated successfully' };
    } else {
      const newPayment = new Payment(paymentData);
      await newPayment.save();
      return { message: 'Payment created successfully' };
    }
  } catch (error) {
    console.error('Payment save error:', error);
    throw new Error('Failed to save payment');
  }
}