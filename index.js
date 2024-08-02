const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const moment = require('moment-timezone');
const cors = require('cors');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://prasetyoamjad:119020qwertY@cluster0.8tjzjzc.mongodb.net/ttv_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

const ttvSchema = new mongoose.Schema({
    patient: String,
    age: Number,
    blood_pressure: String,
    pulse_rate: Number,
    respiratory_rate: Number,
    body_temperature: Number,
    timestamp: {
      type: String,
      default: () => moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm')
    }
  });

const Ttv = mongoose.model('Ttv', ttvSchema);

app.get('/api/ttv', async (req, res) => {
  try {
    const ttvs = await Ttv.find();
    res.json(ttvs);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/ttv', async (req, res) => {
  try {
    const ttv = new Ttv({
        blood_pressure: req.body.blood_pressure,
        pulse_rate: req.body.pulse_rate,
        respiratory_rate: req.body.respiratory_rate,
        body_temperature: req.body.body_temperature,
        patient: req.body.patient,
        age: req.body.age,
      });
    await ttv.save();
    res.send('Record added successfully');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put('/api/ttv/:id', async (req, res) => {
  try {
    const ttv = await Ttv.findById(req.params.id);
    if (!ttv) {
      return res.status(404).send('Record not found');
    }

    ttv.blood_pressure = req.body.blood_pressure || ttv.blood_pressure;
    ttv.pulse_rate = req.body.pulse_rate || ttv.pulse_rate;
    ttv.respiratory_rate = req.body.respiratory_rate || ttv.respiratory_rate;
    ttv.body_temperature = req.body.body_temperature || ttv.body_temperature;
    ttv.patient = req.body.patient || ttv.patient;
    ttv.age = req.body.age || ttv.age;

    await ttv.save();
    res.send('Record updated successfully');
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/api/ttv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Ttv.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'TTV record not found' });
    }

    res.status(200).json({ message: 'TTV record deleted successfully' });
  } catch (error) {
    console.error('Error deleting TTV record:', error);
    res.status(500).json({ message: 'Failed to delete TTV record' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
