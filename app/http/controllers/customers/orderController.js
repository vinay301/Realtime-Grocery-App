const Order = require('../../../models/order');
const moment = require('moment');
const stripe = require('stripe')(process.env.Stripe_Private_Key)

function orderController(){
    return {
        storeOrder(req,res){
           // Validate Request
           const { phone, address, stripeToken, paymentType } = req.body
           if(!phone || !address)
           {
                return res.status(422).json({ message: 'All Fields are required'});
           }

           const order = new Order({
            customerId : req.user._id,
            items : req.session.cart.items,
            phone : phone,
            address : address
           })

           order.save()
           .then(result => {
            return Order.populate(result, { path: 'customerId' });
            })
            .then(placedOrder => {
                //req.flash('success', 'Order Placed Successfully');
                
               
                
                //Stripe Payment
                if(paymentType === 'card')
                {
                    // Convert the token into a Source
                    stripe.sources.create(
                    {
                        type: 'card',
                        token: stripeToken
                    },
                    function(err, source) {
                        if (err) {
                            // Handle the error
                            console.error('Stripe source creation failed:', err);
                            delete req.session.cart;
                            return res.status(500).json({ message: 'Order Placed But Payment Failed. Please contact support for assistance.' });
                        }
            
                        // Now, use the created source for the payment
                        stripe.paymentIntents.create({
                            amount: req.session.cart.totalPrice * 100,
                            source: source.id,
                            currency: 'inr',
                            description: `Grocery order: ${placedOrder._id}`
                        }).then(() => {
                            placedOrder.paymentStatus = true;
                            placedOrder.paymentType = paymentType
                            placedOrder.save().then((ord) => {
                                // Emit Event
                                const eventEmitter = req.app.get('eventEmitter');
                                eventEmitter.emit('orderPlaced', ord);
                                delete req.session.cart;
                                return res.json({ message: 'Payment Successful, Order Placed Successfully' });
                            }).catch((err) => {
                                console.log(err);
                            });
                        }).catch(() => {
                            delete req.session.cart;
                            return res.json({ message: 'Order Placed But Payment Failed, You can pay at delivery time' });
                        });
                    }
                );
                }
                else{
                    delete req.session.cart;
                    return res.json({ message: 'Order Placed Successfully' });
                }
                
                //return res.redirect('/customer/orders');
            })
      
           .catch(err => {
            return res.status(500).json({ message: 'Something Went Wrong' })
                // req.flash('error','Something went wrong!');
                // return res.redirect('/cart');
           })
        },
        async index(req,res)
        {
            const orders = await Order.find({ customerId: req.user._id }
                ,null, { sort: {'createdAt':-1}})
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate,max-stale=0, post-check=0, pre-check=0')
            res.render('customers/orders',{ orders: orders, moment : moment })
            //console.log(orders);
        },
        async show(req,res){
            const order = await Order.findById(req.params.id)
            //Authorized user
            if(req.user._id.toString() === order.customerId.toString())
            {
                return res.render('customers/singleOrder', { order: order })
            }
                return res.redirect('/');
            
        }
    }
}

module.exports = orderController