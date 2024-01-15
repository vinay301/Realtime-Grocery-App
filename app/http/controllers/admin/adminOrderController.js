const Order = require("../../../models/order")

function adminOrderController(){
    return {
        async index(req,res)
        {
            // Order.find({status : { $ne: 'completed' }}, null, {sort : { 'createdAt':-1}})
            // .populate('customerId','-password').exec((err,orders) => {
            //     if(req.xhr){
            //         res.json({ orders })  //send data to client side
            //     }
            //     else{
            //         res.render('admin/orders');
            //     }
                
            // })

            try {
                const orders = await Order.find({ status: { $ne: 'completed' } })
                    .sort({ 'createdAt': -1 })
                    .populate('customerId', '-password')
                    .exec();

                if (req.xhr) {
                    res.json({ orders });  // Send data to the client side
                } else {
                    res.render('admin/orders', { orders });
                }
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
            //populate function gives the detail of the user linked with that customerId
        }
    }
}

module.exports = adminOrderController
