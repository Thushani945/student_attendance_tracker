const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


app.get('/', (req, res) => {
  res.json({ message: 'Attendance Tracker API is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});