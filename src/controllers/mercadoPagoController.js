const db = require("../database/models");
const sequelize = db.sequelize;
// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
const client = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MP_TOKEN,
});

const controller = {
  preferenceCreate: (req, res) => {
    const preference = new mercadopago.Preference(client);

    preference
      .create({
        body: {
          payment_methods: {
            excluded_payment_methods: [
              {
                id: "cmr",
              },
              {
                id: "cencosud",
              },
              {
                id: "cordobesa",
              },
              {
                id: "tarshop",
              },
            ],
            excluded_payment_types: [
              {
                id: "ticket"
              }
    ],
            installments: 12,
          },
          items: [
            {
              title: req.body.title,
              unit_price: Number(req.body.price),
              quantity: Number(req.body.quantity),
              currency_id: "ARS",
            },
          ],
          back_urls: {
            success: "https://healthytoys.com.ar/", //poner la variable env del front
            failure: "https://healthytoys.com.ar/",
            pending: "https://healthytoys.com.ar/",
          },
          auto_return: "approved",
        },
      })
      .then((prefe) => {
        return res.json({
          id: prefe.id,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },

  webHook: (req, res) => {
    console.log(req.body)
    res.status(200).send("ok")
  }
};

module.exports = controller;
