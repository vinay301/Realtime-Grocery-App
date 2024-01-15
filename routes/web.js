// 2dots(..) are used to come out of a folder
const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/adminOrderController');

//Middlewares
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');
function initRoutes(app){
   
    app.get('/', homeController().index)

    
    
    app.get('/login',guest,authController().login)
    app.post('/login',authController().authenticateUser)
    
    app.get('/register',guest,authController().register)
    app.post('/register',authController().addUser)

    app.post('/logout',authController().logout)

    app.get('/cart',cartController().index)
    app.post('/update-cart',cartController().update)

    //Customers Route
    app.post('/orders',auth,orderController().storeOrder)
    app.get('/customer/orders',auth,orderController().index)

    //Admin Routes
    app.get('/admin/orders', admin, adminOrderController().index)
}

module.exports = initRoutes