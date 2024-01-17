// const Order = require("../../../models/order")

// function statusController() {
//     return {
//         updateStatus(req,res){
//             Order.updateOne({_id: req.body.orderId}, {status: req.body.status}, (err,data)=> {
//                 if(err)
//                 {
//                     return res.redirect('/admin/orders')
//                 }
//                 return res.redirect('/admin/orders')
//             })
//         }
//     }
// }

// module.exports = statusController

const Order = require("../../../models/order");
const io = require('../../../../server.js')
function statusController() {
    return {
        updateStatus(req, res) {
          
            const { orderId, status } = req.body;

            // Validate input
            if (!orderId || !status) {
                return res.status(400).send('Invalid input');
            }

            Order.updateOne({ _id: orderId }, { status: status })
                .then(result => {
                  
                    // if (result) {
                    //     //Emit Event
                    //     //const eventEmitter = req.app.get('eventEmitter')
                        
                    //     console.log(io);
                    //     io.emit('orderUpdated', { id: req.body.orderId,status: req.body.status });
                    //     // Update successful
                    //     return res.redirect('/admin/orders');
                    // }
                    //console.log(io);
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderUpdated', { id: req.body.orderId,status: req.body.status });
                    // Update successful
                    return res.redirect('/admin/orders'); 
                    // else {
                    //     // No matching order found
                    //     return res.redirect('/admin/orders');
                    //     //return res.status(404).send('Order not found');
                    // }
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                });
        }
    };
}

module.exports = statusController;
