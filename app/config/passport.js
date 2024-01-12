const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user');
const bcrypt = require('bcrypt');
function init(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email,password,done)=>{
        //Login
        //Check if user exist
        const user = await User.findOne({email: email})
        if(!user){
            return done(null, false, { message: 'No user found with this email' })
        }

        bcrypt.compare(password, user.password).then(match => {
            if(match)
            {
                return done(null, user, { message: 'Logged In Successfully' })
            }
            return done(null, false, { message: 'Incorrect Username Or Password'})
        })
        .catch(err=>{
            return done(null, false, { message: 'Something Went Wrong'})
        })
    } ))
//It stores data in session
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
//It gets the data from session
    passport.deserializeUser((id,done)=>{
    //    User.findById(id, (err,user)=> {
    //     done(err,user);
    //    })
    User.findById(id).exec()
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });

    })


    
}

module.exports = init