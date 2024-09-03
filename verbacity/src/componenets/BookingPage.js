import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookingPage = () => {
    const { uuid } = useParams();
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleBooking = async () => {
        try {
            await axios.post('http://localhost:5000/api/bookings', {
                userName,
                phoneNumber,
                paymentMode,
                chargerUUID: uuid,
                address: '', // you can get the address from the station info if needed
                startTime,
                endTime
            });
            alert('Booking successful!');
        } catch (error) {
            console.error(error);
            alert('Booking failed!');
        }
    };

    return (
        <div className="booking-page">
            <h2>Book Charging Slot</h2>
            <form onSubmit={handleBooking}>
                <label>
                    Name:
                    <input type="text" value={userName} onChange={e => setUserName(e.target.value)} />
                </label>
                <label>
                    Phone Number:
                    <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                </label>
                <label>
                    Payment Mode:
                    <input type="text" value={paymentMode} onChange={e => setPaymentMode(e.target.value)} />
                </label>
                <label>
                    Start Time:
                    <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </label>
                <label>
                    End Time:
                    <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </label>
                <button type="submit">Book</button>
            </form>
        </div>
    );
};

export default BookingPage;
