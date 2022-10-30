require('dotenv').config();
const path = require("path");
const cors = require("cors");
const {logger} = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const fs = require("fs");
const express = require("express");
const app = express();
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const credetials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');


//#region Connect to DB
connectDB();
//#endregion

//#region custom middleware logger
app.use(logger);
//#endregion

//#region  handle options credentials check- before CORS
//and fetch cookies credentials requirement
app.use(credetials);
//#endregion

//#region  CORS
app.use(cors(corsOptions));
//#endregion


app.use(express.urlencoded({extended: false}));

//built-in middleware for json data
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/Login', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));

app.all("*", (req, res) => {
    res.status(404);
    if(req.accepts('html')){
      res.sendFile(path.join(__dirname, "views", "404.html"));
    }else if(req.accepts('json')){
      res.json({error: "404 Not Found"});
    } else {
      res.type('txt').send("404 Not Found");
    }

});

app.use(errorHandler);

const PORT = process.env.PORT || 3500;

mongoose.connection.once('open', ()=>{
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


