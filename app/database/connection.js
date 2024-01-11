const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const connectDB = async() => {
    try{
        //mongoDb Connection string
        const con = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDb Connected : ${con.connection.host}`)
        let mongoStore = new MongoDbStore({
            mongooseConnection : mongoose.connection,
            collection : 'sessions'
        })
        app.use(session({
            secret: process.env.COOKIE_SECRET,
            resave: false,
            saveUninitialized: false,
            store : mongoStore,
            cookie: {maxAge: 1000 * 60 * 60 * 24} //24hrs
        }))
    }
    catch(err){
        console.log(err)
        {
            process.exit(1);
        }
    }
}

app.use(flash())
module.exports = connectDB


