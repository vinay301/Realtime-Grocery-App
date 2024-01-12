const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongo')(session);
const flash = require('express-flash');
const passport = require('passport');

const connectDB = require('./app/database/connection');



dotenv.config({path:'config.env'});
const PORT = process.env.PORT || 8080
//Assets
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//MongoDb Connection
//connectDB();
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`MongoDb Connected : ${mongoose.connection.host}`)
}). catch(err => {
    console.log(err)
    {
        process.exit(1);
    }
});



//Session Store
let mongoStore = new MongoDbStore({
    mongooseConnection : mongoose.connection,
    collection : 'sessions'
})

//Session Configuration
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store : mongoStore,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24hrs
}))

 //Passport Config
 const passportInit = require('./app/config/passport') 
 passportInit(passport)
 app.use(passport.initialize())
 app.use(passport.session())

 app.use(flash())



//Global Middleware
app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user || null;
    next()
})

//set Template Engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

require('./routes/web')(app)



app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})