const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const gmbRoutes = require('./routes/gmbRoutes');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
}));

app.use(express.json())


// This line serves static PDF report files from the 'public/reports' directory.
// When a user accesses '/reports/filename.pdf', the server responds with the corresponding file.
console.log(path.join(__dirname, 'public/reports'));
app.use('/reports', express.static(path.join(__dirname, 'public/reports')));

// set the ejs
app.set('view engine','ejs'); //---this will set the templating engine.. view engine is a templating engine which will help to embede js in html and make dynamic html on server side 
app.set('views',path.join(__dirname,'views')); 

app.use(express.json())
app.use(express.urlencoded({ extended: true })); // to read multipart form data
app.use(express.static(path.join(__dirname, 'public'))); // to serve the static files


// using the routes
app.use('/',gmbRoutes);

// start the server
app.listen(port,()=>{
    console.log("The app is running");
})