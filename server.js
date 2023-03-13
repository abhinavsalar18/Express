const express = require('express');
const connectDb = require('./config/dbConnection');
const errorHandler = require('./middleware/errorHandler');
const validateToken = require('./middleware/validateTokenHandler');
const dotenv = require('dotenv').config();

// const router = express.Router();
connectDb();
const app = express();
const port = process.env.PORT || 5000;


// for parsing the data send in the form of body in request
// This is a middle ware
app.use(express.json());
app.use("/api/contacts", require('./routes/contactRoutes'));
app.use("/api/users", require('./routes/userRoutes'));
app.use(validateToken);
app.use(errorHandler);

app.listen(port, () =>{
 console.log(`Server is running on ${port}`);
});
