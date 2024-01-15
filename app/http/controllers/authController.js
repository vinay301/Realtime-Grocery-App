const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
function authController(){
    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
return {
    login(req,res){
        res.render('auth/login');
    },
    authenticateUser(req,res,next){
        const { email, password } = req.body
        // Validate Request
        if(!email || !password)
        {
            req.flash('error','All fields are required')
            return res.redirect('/login');
        }
        passport.authenticate('local',(err,user,info) => {
            if(err){
                req.flash('error',info.message)
                return next(err)
            }
            if(!user){
                req.flash('error',info.message)
                return res.redirect('/login')
            }

            req.logIn(user, (err) => {
                if(err){
                    req.flash('error',info.message)
                    return next(err)
                }

                return res.redirect(_getRedirectUrl(req));
            })
        })(req,res,next)
    },
    register(req,res)
    {
        res.render('auth/register');
    },
    async addUser(req,res){
        const { name, email, password } = req.body
        // Validate Request
        if(!name || !email || !password)
        {
            req.flash('error','All fields are required')
            req.flash('name',name)
            req.flash('email',email)
            return res.redirect('/register');
        }

        // Check if email exist
        const findUser = await User.findOne({email})
        if(findUser){
            req.flash("error", "Already Registred..!!")
             return res.redirect("/register")
        }

        //Hah Paaword
        const hashedPassword = await bcrypt.hash(password, 10)
        //Add User In DB.
        const user = new User({
            name: name,
            email: email,
            password : hashedPassword
        });

        user.save().then(()=>{
            //Login
            return res.redirect('/');
        }).catch(err => {
            req.flash('error','Something Went Wrong')
            return res.redirect('/register');
            
        })

        // console.log(req.body);
    },
    logout(req, res){
        req.logout(function(err){
            if (err) throw err;
        })
        return res.redirect('/login')
    }
}
}

module.exports = authController;