
import { RequestHandler } from 'express-serve-static-core'
import https from 'https';


export const payment: RequestHandler = async(req, res, next) => {
        
  const https = require('https')

  const params = JSON.stringify({
    "email": "customer@email.com",
    "amount": "20000"
  })
  
  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: 'Bearer sk_test_aab142d87a7435d307254759b64374d657a857e2',
      'Content-Type': 'application/json'
    }
  }
  
  const reqpaystack = https.request(options, (respaystack: any) => {
    let data = ''
  
    respaystack.on('data', (chunk: any) => {
      data += chunk
    });
  
    respaystack.on('end', () => {
      res.status(200).json({data: JSON.parse(data)})
      console.log(JSON.parse(data))
    })
  }).on('error', (error: any) => {
    console.error(error)
  })
  
  reqpaystack.write(params)
  reqpaystack.end()
    // const data = await getLink();

          // return res.status(200).json({
          //   status: `success`,
          //   data
          // })
}
