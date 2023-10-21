import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DocketList.css';
import { Link } from 'react-router-dom';

const DocketList = () => {
    const [dockets, setDockets] = useState([]);

    useEffect(() => {
        axios
            .get('https://dockethub.onrender.com/api/dockets')
            .then((response) => {
                setDockets(response.data);
            })
            .catch((error) => {
                console.error('Error fetching Dockets:', error);
            });
    }, []);

    return (
        <div className="docket-container">
            <h2>Dockets</h2>
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
            <Link to="/">Go back to Home</Link>
        </div>
    );
};

export default DocketList;
