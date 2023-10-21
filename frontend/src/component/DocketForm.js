import React, { useState, useEffect } from 'react';
import './DocketForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const DocketForm = ({ suppliers, poNumberMapping, excelData }) => {

    const uniqueSuppliers = new Set(suppliers.filter(supplier => supplier.trim() !== ''));
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedPoNumber, setSelectedPoNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        startTime: '',
        endTime: '',
        hoursWorked: '',
        ratePerHour: '',
        supplierName: '',
        purchaseOrder: '',
        description: ' '
    });

    useEffect(() => {
        if (selectedPoNumber) {
            handleFetchData();
        }
    }, [selectedPoNumber]);

    const formatDescription = (data) => {
        let formattedDescription = '';
        for (const key in data) {
            formattedDescription += `${key}: ${data[key]}\n`;
        }
        return formattedDescription;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'supplierName') {
            setSelectedSupplier(value);
        } else if (name === 'purchaseOrder') {
            setSelectedPoNumber(value);
        }

        setFormData({ ...formData, [name]: value });
    }

    const handleFetchData = async () => {
        if (selectedPoNumber) {
            const dataForSelectedPoNumber = excelData.filter(row => row[1] === selectedPoNumber);
            const columnHeadings = excelData[0];

            const rowDataWithHeadings = dataForSelectedPoNumber.map(row => {
                const rowData = {};
                columnHeadings.forEach((heading, index) => {
                    rowData[heading] = row[index];
                });
                return rowData;
            });

            const formattedDescription = formatDescription(rowDataWithHeadings[0]);

            setFormData({
                ...formData,
                description: formattedDescription
            });
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/dockets', formData);
            if (response.status === 201) {
                console.log('Docket created successfully:', response.data);
                navigate('/docketList');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                setErrorMessage(errorMessage);
            } else {
                console.error('Error creating Docket:', error);
            }
        }
    }

    return (
        <div className="form-wrapper">
            <h2>Create a Docket</h2>
            <form onSubmit={handleSubmit} className="docket-form">
                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Start Time:</label>
                    <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>End Time:</label>
                    <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Hours Worked:</label>
                    <input
                        type="number"
                        name="hoursWorked"
                        value={formData.hoursWorked}
                        onChange={handleInputChange}
                        min="0"
                        max="1000"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Rate per Hour:</label>
                    <input
                        type="number"
                        name="ratePerHour"
                        value={formData.ratePerHour}
                        onChange={handleInputChange}
                        min="0"
                        max="100000"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Supplier Name:</label>
                    <select
                        name="supplierName"
                        value={formData.supplierName}
                        onChange={handleInputChange}
                        required={true}
                    >
                        <option value="">Select Supplier</option>
                        {[...uniqueSuppliers].map((supplier, index) => (
                            <option key={index} value={supplier}>
                                {supplier}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Purchase Order:</label>
                    <select
                        name="purchaseOrder"
                        value={formData.purchaseOrder}
                        onChange={handleInputChange}
                        required={true}
                    >
                        <option value="">Select Purchase Order</option>
                        {selectedSupplier && poNumberMapping[selectedSupplier] ? (
                            [poNumberMapping[selectedSupplier]].map((poNumber, index) => (
                                <option key={index} value={poNumber}>
                                    {poNumber}
                                </option>
                            ))
                        ) : null}
                    </select>
                </div>

                <button type="submit" className="submit-button">Create Docket</button>
            </form>
        </div>
    );
}

export default DocketForm;