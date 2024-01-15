//this middleware is worked as to prevent pages from unauthorized user, so that only "ADMIN" can visit the page

function admin(req,res,next){
    if(req.isAuthenticated() && req.user.role === 'admin')
    {
        return next()
    }
   
    return res.redirect('/');
}

module.exports = admin