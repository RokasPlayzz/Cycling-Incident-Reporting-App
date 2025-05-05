const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/cyclingIncidents",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const incidentSchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now}
});

const Incident = mongoose.model("Incident", incidentSchema);

app.post("/record-incident", async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const newIncident = new Incident({ latitude, longitude});
        await newIncident.save();
        res.status(201).json({ message: "Incident recorded successfully"});
    } catch (error) {
        res.status(500).json({ error: "Error saving incident"});
    }
});

app.get("/incidents", async (req, res) => {
    try {
        const incidents = await Incident.find();
        res.json(incidents);
    } catch {
        res.status(500).json({ error: "Error fetching incidents"})
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));