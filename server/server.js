const express = require('express');
const cors = require('cors');
require('dotenv').config();
console.log('ENV PATH:', require('path').resolve('.env'));
console.log('PORT VALUE:', process.env.PORT);
const db = require('./config/db');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend server is running!!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
