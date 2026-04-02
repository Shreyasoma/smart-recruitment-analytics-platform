const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const authMiddleware = require('./middleware/auth');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/candidates', authMiddleware, require('./routes/candidate'));
app.use('/api/analytics', authMiddleware, require('./routes/analytics'));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend server is running!!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
