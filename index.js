const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { swaggerUi, swaggerSpec } = require('./swagger');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/myCrudDB');

app.use('/users', userRoutes);

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Optional base route
app.get('/', (req, res) => {
  res.send('Welcome to the User CRUD API');
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
  console.log('Swagger UI at     http://localhost:5000/api-docs');
});
