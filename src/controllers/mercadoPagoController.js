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

let costoEnvio = 0

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
          shipments: {
            mode: "me2",  // 🚛 modo Mercado Envíos
            // receiver_address: {
            //   zip_code: "1834",
            //   street_name: "ibera",//req.body.address.street_name,
            //   street_number: 48,//req.body.address.street_number,
            //   city: {
            //     name: "lomas de zamora"//req.body.address.city
            //   }
            // },
            local_pickup: false,
            dimensions: "90x90x10,6000", // ancho x alto x largo, peso (cm, gramos)
            default_shipping_method: 73328, // puede dejarse vacío para que el usuario elija
            free_methods: [{id: 73328}], // o incluir [ { id: 73328 } ] para promociones de envío gratis
            zip_code: "1834", // Código postal de origen (CABA por ejemplo)
            cost: null // si se usa modo me2, esto se calcula 
          },
          shipping: {
            mode: "me2",
            local_pick_up: false,
            free_shipping: false,
            free_methods: [{id: 73328}]
          },
          back_urls: {
            success: "https://healthytoys.com.ar/",
            failure: "https://healthytoys.com.ar/",
            pending: "https://healthytoys.com.ar/",
          },
          auto_return: "approved",
          metadata: { id_order: req.body.id_order },
          notification_url: process.env.MP_URL_WEBHOOK,
        },
      })
      .then((prefe) => {
        console.log(prefe)
        return res.json({
          id: prefe.id,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },

  // calcularEnvio: async (req, res) => {
  //   try {
  //     const { zip_code, peso, ancho, alto, largo, precio } = req.body;
  
  //     // Simulamos dimensiones
  //     const dimensions = `${ancho}x${alto}x${largo},${peso}`;
  
  //     // ID del vendedor (el tuyo)
  //     const userId = process.env.ML_USER_ID; // Asegurate de tener este dato
  
  //     const url = `https://api.mercadolibre.com/users/${userId}/shipping_options/free?dimensions=${dimensions}&zip_code=${zip_code}&item_price=${precio}&listing_type_id=gold_pro&mode=me2&condition=new&logistic_type=drop_off`;
  
  //     const response = await fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${process.env.MP_TOKEN}`,
  //       },
  //     });
  
  //     const data = await response.json();
  //     if (data && data.coverage.all_country.list_cost && data.coverage.all_country.list_cost > 0) {
  //       costoEnvio = data.coverage.all_country.list_cost//data.options[0].cost;
  //       return res.status(200).json({ costoEnvio });
  //     } else {
  //       return res.status(404).json({ message: 'No se pudo calcular el costo de envío.' });
  //     }
  //   } catch (error) {
  //     console.error('Error calculando envío:', error);
  //     return res.status(500).json({ error: 'Error calculando el costo de envío' });
  //   }
  // },

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
