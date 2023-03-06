// import { RequestHandler } from 'express';
// import got from 'got';

// const private_key = "FLWPUBK_TEST-f141c98b562dd647034f6ce342066d4e-X";
// const secret_key = "FLWSECK_TEST-e990af50c3ccecc7d8ca6b8a81c34ee9-X";

// export const payment:RequestHandler = async(req, res, next) => {

// try {
//     const response = await got.post("https://api.flutterwave.com/v3/payments", {
//         headers: {
//             Authorization: `Bearer ${secret_key}`
//         },
//         json: {
//             tx_ref: "hooli-tx-1920bbtytty",
//             amount: "100",
//             currency: "NGN",
//             //redirect_url: "file:///home/mallamty/Documents/Project/Google-SignIn/payment.html",
//             redirect_url: "https://web.facebook.com/?_rdc=1&_rdr",
//             meta: {
//                 consumer_id: 23,
//                 consumer_mac: "92a3-912ba-1192a"
//             },
//             customer: {
//                 email: "sosanyatemitayonurudeen@gmail.com",
//                 phonenumber: "08087080686",
//                 name: "Temitayo Sosanya"
//             },
//             customizations: {
//                 title: "Testing Flutterwave Payment",
//                 logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png"
//             }
//         }
//     }).json();
// } catch (err: any) {
//     console.log(err.code);
//     console.log(err.response.body);
// }

// }
import { RequestHandler } from 'express-serve-static-core'
import https from 'https'


export const payment: RequestHandler = async(req, res, next) => {
    try {
        const amount = 92345 * 100
        const params = JSON.stringify({
            "email": "tnsosanya@email.com",
            "amount": amount
          })
          let valueee = {};
          const secret_key = "Bearer sk_test_aab142d87a7435d307254759b64374d657a857e2"
          const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            reference: 'sfwhfwofhwofbbveirneoi',
            headers: {
              Authorization: secret_key,
              'Content-Type': 'application/json'
            }
          }
          let data = ''
          let datam
          const value = https.request(options, async res => {
            
            await res.on('data', (chunk) => {
              data += chunk;
              datam = data;
            })
            return res.status(200).json({
              message: datam
            })
            res.on('end', () => {

            })
          }).on('error', error => {
            console.error(error)
          })
          value.write(params);
          value.end();
          
         
          
          
    } catch (error: any) {
        console.log(error);
        
    }
}
