const axios = require('axios');
const Swal = require('sweetalert2')
export function placeOrder(formObject){

    axios.post('/orders', formObject).then((res)=>{
     
        Swal.fire({
          title: res.data.message,
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
        setTimeout(()=>{
          window.location.href = '/customer/orders';
        },1000)
      
      }).catch((err)=>{
        Swal.fire({
          title: err.res.data.message,
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
       
      })
}