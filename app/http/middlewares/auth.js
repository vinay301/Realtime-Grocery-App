//this middleware is worked as to prevent pages from unauthorized user, so that only logged in user can visit the page
const Swal = require('sweetalert2')
function auth(req,res,next){
    if(req.isAuthenticated())
    {
        return next()
    }
   
    return res.redirect('/login');
}

module.exports = auth