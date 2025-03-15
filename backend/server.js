const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const options = { root: path.join(__dirname, 'public', 'images') };
  res.sendFile(imageName, options, (err) => {
    if (err) {
      console.error(`Error sending file: ${err}`);
      res.status(err.status || 404).send('Image not found');
    }
  });
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import routes BEFORE using them
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const usersRoutes = require('./routes/users');
const registrationsRoute = require('./routes/registrations');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/registrations', registrationsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
