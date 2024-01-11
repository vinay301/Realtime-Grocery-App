//client side javascript
// import axios from 'axios';
const axios = require('axios');
const Swal = require('sweetalert2')

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