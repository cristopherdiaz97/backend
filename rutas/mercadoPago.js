const express = require('express');
const router = express.Router();
const mercadopago = require ('mercadopago');
        // Agrega credenciales
    mercadopago.configure({
    access_token: 'APP_USR-1229568728386370-070123-e4ba7b0aede68ec70d0286260c9c0ac9-784438454'
    });
    router.post('/checkout', (req, res) => {
      
        let preference = {
            items: [
              {
                title:req.body.title,
                unit_price: parseInt(req.body.price),
                quantity: 1,
              }
            ],
            "back_urls":{
                "success": 'http://localhost:3000/profile/user/vip',
                "failure": "http://localhost:3000",
                "pending": "http://localhost:3000"
            },
            "payment_methods": {
              "excluded_payment_types": [
                  {
                      "id": "ticket"
                  },
                  {
                    "id": "bank_transfer"
                },
              ]
            }
          };
          mercadopago.preferences.create(preference)
          .then(function(response){
            return res.json(response.body.init_point)
          }).catch(function(error){
            console.log(error);
          });
        });
module.exports = router;