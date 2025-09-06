const express = require('express'); // Express framework
const dotenv = require('dotenv'); //to manage environment variables
const connectDB = require('./config/db'); //database connection

dotenv.config(); //load environment variables

connectDB(); //connect to database

const app = express();

//middleware to parse json data
app.use(express.json());
const PORT = 5000; //port number

//define routes
app.get('/', (req,res)=>{
    res.send('Hello! My Smart Travel Server is running!');
});

//connecting auth routes
app.use('/api/auth', require('./routes/auth.routes'));

//connecting travel records routes
app.use('/api/records', require('./routes/records.routes'));

//start the server
app.listen(PORT, ()=>{
    console.log(`My Smart Travel Server is running on port: ${PORT}`);
});

