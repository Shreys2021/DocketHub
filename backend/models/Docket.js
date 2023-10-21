const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docketSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    hoursWorked: { type: Number, required: true, max: 1000 },
    ratePerHour: { type: Number, required: true, max: 100000 },
    supplierName: { type: String, required: true },
    purchaseOrder: { type: String, required: true },
    description: { type: String, required: true }
})

const Docket = mongoose.model('Docket', docketSchema);


module.exports = Docket;