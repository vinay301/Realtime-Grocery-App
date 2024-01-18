import {loadStripe} from '@stripe/stripe-js';
import { placeOrder } from './apiService';
import { CardWidget } from './CardWidget';

export async function initStripe(){
const stripe = await loadStripe('pk_test_51OZpToSD397djGgjRzipNhJcAsd2eAEJWDNsgs54GqNTqmT2SEEYBdzJToCAs2t1KT95ts2OS8XhG6Ec7bOGVGUh00awTnjkyR');

let card = null;

// function mountWidget(){
//         const elements = stripe.elements()
//     // Custom styling can be passed to options when creating an Element.
//     let style = {
//         base: {
//             color: '#32325d',
//             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//             fontSmoothing: 'antialiased',
//             fontSize: '16px',
//             '::placeholder': {
//                 color: '#aab7c4'
//                 }
//         },
//         invalid: {
//             color: '#fa755a',
//             iconColor: '#fa755a'
//         }
//     };

//     card = elements.create('card', { style, hidePostalCode: true})
//     card.mount('#card-element')
// }

const paymentType = document.querySelector('#paymentType');
if(!paymentType)
{
    return;
}
paymentType.addEventListener('change', (e)=> {
   //console.log(e.target.value)
   if(e.target.value === 'card')
   {
        //display card widget
        card = new CardWidget(stripe)
        card.mount()
        //mountWidget();

   }else{
        card.destroy();
   }
})

    //AJAX Call
const paymentForm = document.querySelector('#payment-form')
if(paymentForm)
{
  paymentForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    let formData = new FormData(paymentForm);
    let formObject = {}
    for (let [key,value] of formData.entries()) {
      formObject[key]= value
    }

    if(!card)
    {
        placeOrder(formObject);
        return;
    }
    //Token From Stripe -> Verify Card
    const token = await card.createToken()
    formObject.stripeToken = token.id;
    placeOrder(formObject)

    // stripe.createToken(card).then((result) => {
        
    //     formObject.stripeToken = result.token.id;
    //     placeOrder(formObject)
        
    // }).catch((err)=>{
    //     console.log(err);
    // })

    //console.log(formObject);
  })
}
}