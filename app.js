const express =require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const app=express();
const userController=require('./controllers/routes/userController');
const constent =require('./config/constant');

app.use(helmet());
app.use(morgan('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
//use api controllers
app.use(constent.API_URL,userController);
app.listen(constent.PORT,()=>{
    console.log("server is running !");
});