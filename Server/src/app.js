const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const db = require('./db/db');
const Routes = require('./routes/student');
// const Models = require('./routes/index')(app);

const app = express();
const port = process.env.PORT || 3000;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
db();

// Routes
app.use('/api', Routes);

app.get('/', (req, res) => {
  res.send('<h1>welcome to Google-Drive</h1>');
});


app.listen(port, () => {
  console.log(`Server running at:- http://localhost:${port}`);
});