const db = require("../database/models");
const sequelize = db.sequelize;
// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
const client = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MP_TOKEN,
});

//Otra forma de llamar a los modelos
const Orders = db.Orders; 

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
                id: "ticket",
              },
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
            success: "https://healthytoys.store/",
            failure: "https://healthytoys.store/",
            pending: "https://healthytoys.store/",
          },
          auto_return: "approved",
          metadata: { id_order: req.body.id_order },
          notification_url: process.env.MP_URL_WEBHOOK,
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

  webHook: async (req, res) => {
    const paymentId = req.query.id;

    try {
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.MP_TOKEN}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        if (
          data &&
          data.status === "approved" &&
          data.status_detail === "accredited"
        ) {
        }
        Orders.update(
          {
            isPaid: true,
          },
          {
            where: { id_order: data.metadata.id_order },
          }
        );
      //mandar email agradeciendo la compra con los datos de lo comprado  
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error:", error);
      res.sendStatus(500);
    }
  },
};
module.exports = controller;
