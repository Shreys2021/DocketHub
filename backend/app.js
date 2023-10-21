const express = require('express');
const mongoose = require('mongoose');
const Docket = require('./models/Docket')
const cors = require('cors');

const app = express()

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://shreyas:shreyas@cluster0.ey6seza.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,

    useUnifiedTopology: true

}).then(() => {
    console.log("Connection open");
}).catch(err => {
    console.log("OH NO ERROR");
    console.log(err);
})


app.get('/', async (req, res) => {
    res.send("hiiii")
})

app.get('/api/dockets', async (req, res) => {
    try {
        const dockets = await Docket.find();
        res.json(dockets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/dockets', async (req, res) => {
    console.log("iiii")
    try {
        const existingDocket = await Docket.findOne({ name: req.body.name });
        if (existingDocket) {
            return res.status(400).json({ error: 'Duplicate name is not allowed' });
        }
        const newDocket = new Docket(req.body);
        const savedDocket = await newDocket.save();
        res.status(201).json(savedDocket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.all('*', (req, res, next) => {
    res.send("NO PAGE FOUND");

})

app.listen(5000, () => {
    console.log("listening on port 5000");
})