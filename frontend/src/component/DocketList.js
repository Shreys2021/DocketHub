import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DocketList.css';
import { Link } from 'react-router-dom';

const DocketList = () => {
    const [dockets, setDockets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/dockets')
            .then((response) => {
                setDockets(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching Dockets:', error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="docket-container">
            <h2>Dockets</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : dockets.length === 0 ? (
                <p>No dockets found.</p>
            ) : (
                <ul>
                    {dockets.map((docket) => (
                        <li key={docket._id} className="docket-item">
                            <h3>{docket.name}</h3>
                            <div className="docket-details">
                                <p>
                                    <strong>Description:</strong> {docket.description}
                                </p>
                                <p>
                                    <strong>Start Time:</strong> {docket.startTime}
                                </p>
                                <p>
                                    <strong>End Time:</strong> {docket.endTime}
                                </p>
                                <p>
                                    <strong>Hours Worked:</strong> {docket.hoursWorked}
                                </p>
                                <p>
                                    <strong>Rate per Hour:</strong> {docket.ratePerHour}
                                </p>
                                <p>
                                    <strong>Supplier Name:</strong> {docket.supplierName}
                                </p>
                                <p>
                                    <strong>Purchase Order:</strong> {docket.purchaseOrder}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/">Go back to Home</Link>
        </div>
    );
};

export default DocketList;
