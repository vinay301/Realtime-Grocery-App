//client side javascript
// import axios from 'axios';
const axios = require('axios');
const Swal = require('sweetalert2')
const moment = require('moment');
import { initAdmin } from './admin';
import { initStripe } from './stripe';


let addToCart = document.querySelectorAll('.addToCart')
let cartCounter = document.querySelector('#cartCounter');

 function updateCart(grocery){
     axios.post('/update-cart',grocery)
         .then((res)=>{
         //console.log('Item added to cart',res);
         Swal.fire({
            title: "Item successfully added to cart",
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          });
         cartCounter.innerText = res.data.totalQty

     }).catch(error => {
            // Handling errors if the request encounters any issues
            //console.error('Error adding item to cart:', error);
            Swal.fire({
                title: "Error adding item to cart",
                showClass: {
                  popup: `
                    animate__animated
                    animate__fadeInUp
                    animate__faster
                  `
                },
                hideClass: {
                  popup: `
                    animate__animated
                    animate__fadeOutDown
                    animate__faster
                  `
                }
              });
        });
 }

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e)=>{
        //while clicking addToCart, we send the details of the items to the session;
        let grocery = JSON.parse(btn.dataset.grocery);
        updateCart(grocery);
        //console.log(grocery);
    })
})

//Remove Alert Message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg)
{
  setTimeout(() => {
    alertMsg.remove()
  },2000)
}

// initAdmin()


//Change order status
let statuses = document.querySelectorAll('.status-line')

let hiddenInput = document.querySelector('#hiddenInput')
let order =  hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order){
  statuses.forEach((status) => {
    status.classList.remove('step-completed')
    status.classList.remove('current-stage')
  })
  let stepCompleted  =  true;
  statuses.forEach((status)=>{
    let dataProp = status.dataset.status
    if(stepCompleted)
    {
      status.classList.add('step-completed')
    }
    if(dataProp === order.status){
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format('hh:mm A')
      status.appendChild(time);
      if(status.nextElementSibling)
      {
        status.nextElementSibling.classList.add('current-stage')
      }
     
    }
  })
}

updateStatus(order)


initStripe()




//Socket
let socket = io()
//Join
if(order)
{
  socket.emit('join', `order_${order._id}`);
}
//Admin socket --> order displayed realtime
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
  initAdmin(socket)
  socket.emit('join','adminRoom')
}


socket.on('orderUpdated', (data)=> {
  const updatedOrder = { ...order }
  //Update UI
  updatedOrder.updatedAt = moment().format()
  updatedOrder.status = data.status
  updateStatus(updatedOrder)
  Swal.fire({
    title: "Order Updated",
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `
    }
  });
  //console.log(data)
})

