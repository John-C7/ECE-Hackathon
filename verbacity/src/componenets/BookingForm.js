import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate, useLocation } from 'react-router-dom';

// Function to generate a random alphanumeric token
const generateToken = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase(); // Generates a 8-character alphanumeric token
};

const BookingForm = () => {
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation(); // Initialize location
  const { slotDetails, costPerUnit } = location.state || {}; // Destructure state

  // Default values
  const defaultName = 'Aditya Paul';
  const defaultPhoneNumber = '+91 6291 743 375';
  const defaultVehicleReg = 'KA 05 2278';
  const defaultStartTime = '2024-07-30T10:15';
  const defaultEndTime = '2024-07-29T12:00';
  const defaultBatteryCapacity = 50;
  const defaultCurrentCharge = 20;

  // State for form fields
  const [name, setName] = useState(defaultName);
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);
  const [vehicleReg, setVehicleReg] = useState(defaultVehicleReg);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [batteryCapacity, setBatteryCapacity] = useState(defaultBatteryCapacity);
  const [currentCharge, setCurrentCharge] = useState(defaultCurrentCharge);
  const [token, setToken] = useState(generateToken()); // Initialize token

  const handleSubmit = (e) => {
    e.preventDefault();

    const remainingCharge = 100 - currentCharge;
    const totalPowerConsumed = (batteryCapacity * remainingCharge) / 100; // in kWh

    const costPerUnitValue = parseFloat(costPerUnit?.replace('₹', '').replace(' per unit', '')) || 12.5;
    const totalCost = totalPowerConsumed * costPerUnitValue;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Parking Slot Booking Details', 14, 16);

    doc.autoTable({
      head: [['Field', 'Details']],
      body: [
        ['Token Number', token], // Add Token Number
        ['Name', name],
        ['Phone Number', phoneNumber],
        ['Vehicle Registration Number', vehicleReg],
        ['Slot Details', `Slot ID: ${slotDetails?.id || 'N/A'}, Time: ${startTime} to ${endTime}`],
        ['Battery Capacity (kWh)', batteryCapacity],
        ['Current Charge (%)', currentCharge],
        ['Total Power Consumed (kWh)', totalPowerConsumed.toFixed(2)],
        ['Cost Per Unit', costPerUnit || '₹12.5 per unit'],
        ['Total Cost (₹)', totalCost.toFixed(2)],
      ],
      margin: { top: 30 },
      styles: {
        fontSize: 12,
        cellPadding: 2,
        lineColor: [44, 62, 80],
        lineWidth: 0.75,
      },
    });

    doc.save('booking-details.pdf');
  };

  return (
    <div className="booking-form-container">
      <h2>Booking Form</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleReg">Vehicle Registration Number:</label>
          <input
            id="vehicleReg"
            type="text"
            value={vehicleReg}
            onChange={(e) => setVehicleReg(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="startTime">Start Time:</label>
          <input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="endTime">End Time:</label>
          <input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="batteryCapacity">Battery Capacity (kWh):</label>
          <input
            id="batteryCapacity"
            type="number"
            value={batteryCapacity}
            onChange={(e) => setBatteryCapacity(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="currentCharge">Current Charge (%):</label>
          <input
            id="currentCharge"
            type="number"
            value={currentCharge}
            onChange={(e) => setCurrentCharge(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Generate PDF</button>
      </form>

      <style jsx>{`
        .booking-form-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #555;
        }

        .form-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          box-sizing: border-box;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
          outline: none;
        }

        .submit-button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background-color: #007bff;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }

        .submit-button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

export default BookingForm;
